import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthorizedSession } from '@/services/auth.service';
import type { IEntityService } from '@/services/createEntityService';

/**
 * Os handlers REST que as entidades compartilham. As rotas de monstro, cidadão
 * e jogador eram o mesmo arquivo três vezes: mesmos verbos, mesma guarda de
 * papel, mesmo bloco de erro.
 *
 * A pasta se chama `_entity` com underline para o App Router não tratá-la como
 * um segmento de rota.
 */

interface IOptions<T> {
  service: IEntityService<T>;
  // Aparece nas mensagens de erro: "Cidadão não encontrado".
  notFoundLabel: string;
  createErrorLabel: string;
}

type SlugContext = { params: Promise<{ slug: string }> };

function serverError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  return NextResponse.json({ error: message }, { status: 500 });
}

// Escrita exige sessão com papel de edição. Leitura é aberta, como sempre foi.
async function denyIfNotEditor() {
  const session = await getAuthorizedSession();
  if (!session || session.role === 'viewer') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }
  return null;
}

/** Handlers de `/api/<entidade>`. */
export function createCollectionHandlers<T>({
  service,
  createErrorLabel,
}: IOptions<T>) {
  return {
    async GET() {
      try {
        await connectDB();
        return NextResponse.json(await service.getAll());
      } catch (error) {
        return serverError(error);
      }
    },

    async POST(request: Request) {
      try {
        const denied = await denyIfNotEditor();
        if (denied) return denied;

        await connectDB();
        const body = await request.json();
        const result = await service.create(body);
        if (!result.success) throw new Error(createErrorLabel);
        return NextResponse.json(result.data);
      } catch (error) {
        return serverError(error);
      }
    },
  };
}

/** Handlers de `/api/<entidade>/[slug]`. */
export function createSlugHandlers<T>({ service, notFoundLabel }: IOptions<T>) {
  const notFound = () =>
    NextResponse.json({ error: notFoundLabel }, { status: 404 });

  return {
    async GET(_request: Request, { params }: SlugContext) {
      try {
        await connectDB();
        const { slug } = await params;
        const result = await service.getBySlug(slug);
        if (!result.success) return notFound();
        return NextResponse.json(result.data);
      } catch (error) {
        return serverError(error);
      }
    },

    async PUT(request: Request, { params }: SlugContext) {
      try {
        const denied = await denyIfNotEditor();
        if (denied) return denied;

        await connectDB();
        const { slug } = await params;
        const body = await request.json();
        const result = await service.update(slug, body);
        if (!result.success) return notFound();
        return NextResponse.json(result.data);
      } catch (error) {
        return serverError(error);
      }
    },

    async DELETE(_request: Request, { params }: SlugContext) {
      try {
        const denied = await denyIfNotEditor();
        if (denied) return denied;

        await connectDB();
        const { slug } = await params;
        const result = await service.remove(slug);
        if (!result.success) return notFound();
        return NextResponse.json({ success: true });
      } catch (error) {
        return serverError(error);
      }
    },
  };
}
