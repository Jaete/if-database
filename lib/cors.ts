import { NextResponse } from 'next/server';

export function corsResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export function corsOptions() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

function forumOriginHeaders(origin: string | null): Record<string, string> {
  if (!origin || origin !== process.env.FORUM_ORIGIN) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

export function forumCorsResponse(
  body: unknown,
  origin: string | null,
  status = 200
) {
  return NextResponse.json(body, {
    status,
    headers: forumOriginHeaders(origin),
  });
}

export function forumCorsOptions(origin: string | null) {
  return new NextResponse(null, {
    status: 204,
    headers: { ...forumOriginHeaders(origin), 'Access-Control-Max-Age': '86400' },
  });
}
