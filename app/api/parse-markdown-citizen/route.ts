import { NextResponse } from 'next/server';
import * as mammoth from 'mammoth';
import { parseCitizenSheetLines } from '@/services/citizenSheet.service';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado.' },
        { status: 400 }
      );
    }

    let content: string;
    if (file.name.toLowerCase().endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
    } else {
      content = await file.text();
    }

    const parsedData = parseCitizenSheetLines(content.split('\n'));

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Error parsing citizen markdown:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erro ao processar arquivo';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
