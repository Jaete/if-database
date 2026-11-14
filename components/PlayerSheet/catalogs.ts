import type { IRaceCatalogEntry } from '@/db/races/race.d';
import type { ITalentOption } from '@/services/talentCatalog';

/**
 * Os catálogos que o modo de edição baixa — as raças e os talentos.
 *
 * Em módulo, e não em estado de hook, porque vários painéis pedem a mesma
 * coisa na mesma tela (a placa, a lista de habilidades, o seletor): a segunda
 * chamada reaproveita a primeira. Quem só lê a ficha nunca chega aqui, porque
 * a leitura já traz tudo resolvido.
 */

let races: Promise<IRaceCatalogEntry[]> | null = null;

/**
 * Sem opções, o catálogo é compartilhado e guardado. A camada de escolha pede
 * `fresh` (e o `forPlayer` da ficha): quem tem cada raça única muda quando
 * outra ficha salva, então essa resposta nunca fica guardada.
 */
export const loadRaceCatalog = (options?: {
  fresh?: boolean;
  forPlayer?: string;
}): Promise<IRaceCatalogEntry[]> => {
  const fetchCatalog = () =>
    fetch(
      `/api/races/catalog${
        options?.forPlayer
          ? `?for=${encodeURIComponent(options.forPlayer)}`
          : ''
      }`
    ).then((res) => (res.ok ? res.json() : Promise.reject(new Error())));

  if (options?.fresh) return fetchCatalog();
  if (!races) {
    races = fetchCatalog().catch((error) => {
      // Uma falha não pode ficar guardada: a próxima abertura tenta de novo.
      races = null;
      throw error;
    });
  }
  return races;
};

const talents = new Map<string, Promise<ITalentOption[]>>();

export const loadTalentOptions = (
  classId: string
): Promise<ITalentOption[]> => {
  let promise = talents.get(classId);
  if (!promise) {
    promise = fetch(`/api/talents/options?classId=${classId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .catch((error) => {
        talents.delete(classId);
        throw error;
      });
    talents.set(classId, promise);
  }
  return promise;
};

/** O que a ficha sabe de uma magia escolhida na camada, antes de salvar. */
export interface IPickedSpell {
  name: string;
  circle: number;
  school?: string;
  classes?: string;
}

/**
 * As magias escolhidas nesta sessão, por id. A leitura da ficha só resolve o
 * nome e o círculo depois de salvar; até lá a lista de magias lê daqui. É um
 * cache de módulo pelo mesmo motivo dos catálogos acima.
 */
export const pickedSpells = new Map<string, IPickedSpell>();
