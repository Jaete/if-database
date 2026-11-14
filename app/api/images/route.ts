import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthorizedSession } from '@/services/auth.service';
import { getEmbedSession } from '@/services/embedAuth.service';
import {
  ImageUploadError,
  MAX_INPUT_BYTES,
  createImage,
} from '@/services/image.service';

const isSameOriginRequest = (request: Request) => {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
};

// sharp é nativo: só roda no Node, nunca no edge.
export const runtime = 'nodejs';

const fail = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

// O multipart pesa um pouco mais que o arquivo.
const MAX_BODY_BYTES = MAX_INPUT_BYTES + 64 * 1024;

/** Lê o corpo contando os bytes; null se passar do limite (aborta a leitura). */
async function readLimited(request: Request): Promise<Uint8Array | null> {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let at = 0;
  for (const chunk of chunks) {
    out.set(chunk, at);
    at += chunk.length;
  }
  return out;
}

// Qualquer usuário logado envia: jogador também precisa da imagem da própria
// ficha. Anônimo não. Dentro do iframe do fórum só existe a sessão do embed
// (cookie `SameSite=None`, ambiente): por isso ela exige também `Origin` da
// própria aplicação, como todas as escritas do embed.
export async function POST(request: Request) {
  const embed = isSameOriginRequest(request) ? await getEmbedSession() : null;
  const session = (await getAuthorizedSession()) ?? embed;
  if (!session) return fail('Entre para enviar imagens.', 401);

  // Content-Length ausente ou falso não pode liberar a leitura: o corpo é
  // contado byte a byte abaixo, mas recusar cedo poupa trabalho.
  const length = Number(request.headers.get('content-length'));
  if (!Number.isFinite(length) || length <= 0) {
    return fail('Informe o tamanho do envio.', 411);
  }
  if (length > MAX_BODY_BYTES) return fail('A imagem passa de 10 MB.', 413);

  const body = await readLimited(request);
  if (!body) return fail('A imagem passa de 10 MB.', 413);

  let file: FormDataEntryValue | null;
  try {
    const contentType = request.headers.get('content-type') ?? '';
    file = (
      await new Response(new Blob([new Uint8Array(body)]), {
        headers: { 'content-type': contentType },
      }).formData()
    ).get('file');
  } catch {
    return fail('Envio inválido.', 400);
  }
  if (!(file instanceof File)) return fail('Nenhum arquivo enviado.', 400);

  try {
    await connectDB();
    const image = await createImage(
      Buffer.from(await file.arrayBuffer()),
      session.username
    );
    return NextResponse.json(
      { url: `/api/images/${image.id}`, ...image },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ImageUploadError) {
      return fail(error.message, error.status);
    }
    return fail('Não foi possível salvar a imagem.', 500);
  }
}
