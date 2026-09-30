import type { Model } from 'mongoose';

/**
 * As seis operações de CRUD que monstros, cidadãos e jogadores compartilham.
 *
 * Antes desta fábrica cada entidade mantinha uma cópia literal do mesmo arquivo
 * — `citizen.service.ts` e `monster.service.ts` diferiam só no nome do model.
 * Extensões de uma entidade só (o índice e a paginação de monstros) ficam por
 * cima, no serviço da entidade, e não aqui dentro.
 *
 * Sem `'use server'` de propósito: aquela diretiva exige que o módulo exporte
 * apenas funções async, e esta fábrica devolve um objeto. Os serviços de
 * entidade mantêm a diretiva e delegam para cá.
 */
export interface IEntityResult<T> {
  success: boolean;
  data?: T;
}

export interface IEntityService<T> {
  create: (data: T) => Promise<IEntityResult<T>>;
  getAll: () => Promise<T[]>;
  getBySlug: (slug: string) => Promise<IEntityResult<T>>;
  getBySlugs: (slugs: string[]) => Promise<T[]>;
  update: (slug: string, updateData: Partial<T>) => Promise<IEntityResult<T>>;
  remove: (slug: string) => Promise<IEntityResult<T>>;
}

export function createEntityService<T>(
  // O tipo exato do model não acrescenta segurança aqui: as interfaces do
  // projeto estendem `Document` de formas diferentes, e o que importa é o T
  // devolvido.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>
): IEntityService<T> {
  return {
    async create(data) {
      const doc = await model.create(data as Record<string, unknown>);
      if (!doc) return { success: false };
      return { success: true, data: doc as T };
    },

    async getAll() {
      return model.find().select('-__v').lean<T[]>();
    },

    async getBySlug(slug) {
      const doc = await model.findOne({ slug });
      if (!doc) return { success: false };
      return { success: true, data: doc as T };
    },

    async getBySlugs(slugs) {
      return model
        .find({ slug: { $in: slugs } })
        .select('-__v')
        .lean<T[]>();
    },

    async update(slug, updateData) {
      const doc = await model.findOneAndUpdate({ slug }, updateData, {
        new: true,
        runValidators: true,
      });
      if (!doc) return { success: false };
      return { success: true, data: doc as T };
    },

    async remove(slug) {
      const doc = await model.findOneAndDelete({ slug });
      if (!doc) return { success: false };
      return { success: true };
    },
  };
}
