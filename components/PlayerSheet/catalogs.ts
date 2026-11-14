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

export const loadRaceCatalog = (): Promise<IRaceCatalogEntry[]> => {
  if (!races) {
    races = fetch('/api/races/catalog')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .catch((error) => {
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
