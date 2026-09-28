import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getMonstersBySlugs } from '@/services/monster.service';
import { corsResponse, corsOptions } from '@/lib/cors';

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slugs } = body;

    if (!Array.isArray(slugs) || slugs.length === 0) {
      return corsResponse({ error: 'slugs must be a non-empty array' }, 400);
    }

    await connectDB();
    const monsters = await getMonstersBySlugs(slugs);
    return corsResponse(monsters);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return corsResponse({ error: errorMessage }, 500);
  }
}
