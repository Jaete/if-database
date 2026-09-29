import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAllCitizens, createCitizen } from '@/services/citizen.service';
import { getAuthorizedSession } from '@/services/auth.service';

export async function GET() {
  try {
    await connectDB();
    const citizens = await getAllCitizens();
    return NextResponse.json(citizens);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const result = await createCitizen(body);
    if (!result.success) throw new Error('Falha ao criar cidadão');
    return NextResponse.json(result.data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
