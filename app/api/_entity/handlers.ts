import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthorizedSession } from '@/services/auth.service';
import { stripUnsafeKeys } from '@/lib/sanitize';
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
  /**
   * Regra de negócio conferida antes de gravar; devolver uma mensagem recusa
   * a escrita com 409.
   *
   * Existe para a classe única: esconder a opção na lista é interface, e
   * interface não é controle — a página pode estar aberta desde antes de
   * alguém mais pegar a classe. `slug` é o documento sendo alterado, ausente
   * na criação.
   */
  validate?: (
    body: Record<string, unknown>,
    context: { slug?: string }
  ) => Promise<string | null>;
  /**
   * Escrita própria no lugar de `service.update`, para a entidade que limpa e
   * confere o corpo antes de gravar (a ficha do jogador).
   */
  update?: (
    slug: string,
    body: Record<string, unknown>
  ) => ReturnType<IEntityService<T>['update']>;
  /**
   * Reconhece o erro de validação do corpo que `update` lança: devolve a
   * mensagem para responder 400, ou null para seguir como falha interna.
   */
  clientError?: (error: unknown) => string | null;
  /**
   * Redige o que a leitura PÚBLICA devolve (GET de lista e de item). Recebe se
   * quem lê é a staff do app (admin ou editor).
   */
  redact?: (doc: Record<string, unknown>, isStaff: boolean) => unknown;
  /**
   * Barra a escrita (PUT e DELETE por slug) por uma regra da entidade: recebe o
   * slug e a sessão; devolver uma mensagem recusa com 403.
   */
  guardWrite?: (
    slug: string,
    session: { username: string; forumUserId?: number }
  ) => Promise<string | null>;
  /** Criação própria no lugar de `service.create` (a ficha do jogador). */
  create?: (
    body: Record<string, unknown>
  ) => ReturnType<IEntityService<T>['create']>;
}

// Classe ou raça única tomada por outra ficha ao mesmo tempo: 409, não 400.
const isUniqueConflict = (error: unknown): error is Error =>
  error instanceof Error && error.name === 'UniqueConflictError';

type SlugContext = { params: Promise<{ slug: string }> };

function serverError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  return NextResponse.json({ error: message }, { status: 500 });
}

async function isStaffReader() {
  const session = await getAuthorizedSession();
  return !!session && session.role !== 'viewer';
}

async function barWrite(slug: string, guard?: IOptions<unknown>['guardWrite']) {
  if (!guard) return null;
  const session = await getAuthorizedSession();
  if (!session) return null;
  const message = await guard(slug, session);
  return message
    ? NextResponse.json({ error: message }, { status: 403 })
    : null;
}

const plain = (doc: unknown): Record<string, unknown> =>
  JSON.parse(JSON.stringify(doc));

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
  validate,
  create,
  clientError,
  redact,
}: IOptions<T>) {
  return {
    async GET() {
      try {
        await connectDB();
        const all = await service.getAll();
        if (!redact) return NextResponse.json(all);
        const staff = await isStaffReader();
        return NextResponse.json(
          (all as unknown[]).map((doc) => redact(plain(doc), staff))
        );
      } catch (error) {
        return serverError(error);
      }
    },

    async POST(request: Request) {
      try {
        const denied = await denyIfNotEditor();
        if (denied) return denied;

        await connectDB();
        const body = stripUnsafeKeys(await request.json());

        const refused = await validate?.(body, {});
        if (refused) {
          return NextResponse.json({ error: refused }, { status: 409 });
        }

        const result = await (create
          ? create(body)
          : service.create(body as T));
        if (!result.success) throw new Error(createErrorLabel);
        return NextResponse.json(result.data);
      } catch (error) {
        if (isUniqueConflict(error)) {
          return NextResponse.json({ error: error.message }, { status: 409 });
        }
        const refused = clientError?.(error);
        if (refused) {
          return NextResponse.json({ error: refused }, { status: 400 });
        }
        return serverError(error);
      }
    },
  };
}

/** Handlers de `/api/<entidade>/[slug]`. */
export function createSlugHandlers<T>({
  service,
  notFoundLabel,
  validate,
  update,
  clientError,
  redact,
  guardWrite,
}: IOptions<T>) {
  const notFound = () =>
    NextResponse.json({ error: notFoundLabel }, { status: 404 });

  return {
    async GET(_request: Request, { params }: SlugContext) {
      try {
        await connectDB();
        const { slug } = await params;
        const result = await service.getBySlug(slug);
        if (!result.success) return notFound();
        return NextResponse.json(
          redact
            ? redact(plain(result.data), await isStaffReader())
            : result.data
        );
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
        const barred = await barWrite(slug, guardWrite);
        if (barred) return barred;
        const body = stripUnsafeKeys(await request.json());

        const refused = await validate?.(body, { slug });
        if (refused) {
          return NextResponse.json({ error: refused }, { status: 409 });
        }

        const result = await (update
          ? update(slug, body)
          : service.update(slug, body));
        if (!result.success) return notFound();
        return NextResponse.json(result.data);
      } catch (error) {
        if (isUniqueConflict(error)) {
          return NextResponse.json({ error: error.message }, { status: 409 });
        }
        const refused = clientError?.(error);
        if (refused) {
          return NextResponse.json({ error: refused }, { status: 400 });
        }
        return serverError(error);
      }
    },

    async DELETE(_request: Request, { params }: SlugContext) {
      try {
        const denied = await denyIfNotEditor();
        if (denied) return denied;

        await connectDB();
        const { slug } = await params;
        const barred = await barWrite(slug, guardWrite);
        if (barred) return barred;
        const result = await service.remove(slug);
        if (!result.success) return notFound();
        return NextResponse.json({ success: true });
      } catch (error) {
        return serverError(error);
      }
    },
  };
}
