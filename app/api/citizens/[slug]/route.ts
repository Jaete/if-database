import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {
  getCitizenBySlug,
  updateCitizen,
  deleteCitizen,
} from '@/services/citizen.service';
import { getAuthorizedSession } from '@/services/auth.service';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const result = await getCitizenBySlug(slug);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Cidadão não encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(result.data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    await connectDB();
    const { slug } = await params;
    const body = await request.json();
    const result = await updateCitizen(slug, body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Cidadão não encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(result.data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    await connectDB();
    const { slug } = await params;
    const result = await deleteCitizen(slug);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Cidadão não encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
