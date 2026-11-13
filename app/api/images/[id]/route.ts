import { connectDB } from '@/lib/db';
import { getImageData } from '@/services/image.service';

export const runtime = 'nodejs';

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  try {
    await connectDB();
    const image = await getImageData(id);
    if (!image) return new Response('Imagem não encontrada', { status: 404 });

    return new Response(new Uint8Array(image.data), {
      headers: {
        'Content-Type': image.contentType,
        'X-Content-Type-Options': 'nosniff',
        // Imagens nunca mudam: trocar a arte é um novo id.
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(image.data.length),
      },
    });
  } catch {
    return Response.json(
      { error: 'Não foi possível carregar a imagem.' },
      { status: 500 }
    );
  }
}
