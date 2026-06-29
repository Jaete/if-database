import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'crypto';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import User from '@/db/users/users';
import Time from '@/lib/time';

const TOKEN_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret';
const COOKIE_NAME = 'session';
const TOKEN_EXPIRY = Time.days(3);

// ===== PASSWORD HASHING =====

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':');
  const hashBuf = scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');

  if (hashBuf.length !== keyBuf.length) return false;
  return timingSafeEqual(hashBuf, keyBuf);
}

// ===== TOKEN MANAGEMENT =====

interface TokenPayload {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

function base64url(str: string): string {
  return Buffer.from(str).toString('base64url');
}

function fromBase64url(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf-8');
}

export function signToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + TOKEN_EXPIRY;

  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, iat, exp }));
  const signature = createHmac('sha256', TOKEN_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSig = createHmac('sha256', TOKEN_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    const sigBuf = Buffer.from(signature, 'base64url');
    const expectedBuf = Buffer.from(expectedSig, 'base64url');

    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

    const payload: TokenPayload = JSON.parse(fromBase64url(body));

    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export function refreshToken(token: string): string | null {
  const payload = verifyToken(token);
  if (!payload) return null;
  return signToken({ username: payload.username, role: payload.role });
}

// ===== COOKIE HELPERS =====

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRY,
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionFromCookie(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ===== AUTH SERVICE =====

export async function authenticateUser(
  username: string,
  password: string
): Promise<{
  success: boolean;
  token?: string;
  user?: { username: string; role: string };
  error?: string;
}> {
  try {
    await connectDB();
    const user = await User.findOne({ username }).lean();

    if (!user) {
      return { success: false, error: 'Credenciais inválidas' };
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return { success: false, error: 'Credenciais inválidas' };
    }

    const token = signToken({ username: user.username, role: user.role });
    return {
      success: true,
      token,
      user: { username: user.username, role: user.role },
    };
  } catch (error) {
    console.error('Auth error:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
}
