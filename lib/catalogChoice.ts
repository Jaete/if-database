import type { ICitizenRaceChoice, ITalentSlots } from '@/db/citizens/citizen.d';
import type { IRaceCatalogEntry } from '@/db/races/race.d';
import type { ITalentOption } from '@/services/talentCatalog';

/**
 * O que a camada de escolha da ficha passa aos catálogos (raças, classes,
 * magias, talentos) para eles virarem seletores.
 *
 * Sem `choice`, cada catálogo continua sendo a tela do visitante. Com ele, o
 * organismo esconde as ferramentas de admin, liga as ações de escolher e
 * devolve a escolha a quem montou a camada: ele nunca grava nada.
 */

/** A raça (e a escolha dentro dela) como a bandeja a mantém. */
export interface IRaceDraft {
  slug: string;
  choice: ICitizenRaceChoice;
}

export interface IRaceChoice {
  kind: 'race';
  catalog: IRaceCatalogEntry[];
  /** O que a ficha tem hoje, para o selo "Atual". */
  current?: IRaceDraft & { label: string };
  /** O que está na bandeja; é o que as telas mostram como escolhido. */
  draft?: IRaceDraft;
  /** Escolhe a raça (zerando a escolha dentro dela) ou ajusta a escolha. */
  onChange: (draft: IRaceDraft) => void;
  /**
   * `origin`: a página aberta é a de uma raça de origem do Mestiço. A ação
   * vira "Usar como origem" em vez de "Usar esta raça".
   */
  mode: 'pick' | 'origin';
  /** Abre a página real de uma raça dentro da camada (card, "ver raça"). */
  onOpen: (slug: string, mode: 'pick' | 'origin') => void;
}

export interface IClassChoice {
  kind: 'class';
  /** `_id` da classe da ficha hoje. */
  currentId?: string;
  /** `_id` da classe na bandeja. */
  draftId?: string;
  /** `_id` da classe → nome de quem a tem, nas únicas já tomadas. */
  takenUnique: Record<string, string>;
  onPick: (klass: { _id: string; name: string; slug: string }) => void;
}

export interface IArchetypeChoice {
  kind: 'archetype';
  classSlug: string;
  level: number;
  currentSlug?: string;
  draftSlug?: string;
  onPick: (slug: string) => void;
}

export interface ISpellChoice {
  kind: 'spells';
  classId: string;
  /** Ids (`_id`) das magias já preparadas, rascunho incluído. */
  known: string[];
  /** Ids preparados na ficha gravada, para marcar o que mudou. */
  saved: string[];
  /** Por círculo: [truques, 1º, 2º, …]. */
  limits: number[];
  /** Quantas já preparadas por círculo (a camada mede com o catálogo). */
  counts: number[];
  /** Maior círculo que o personagem conjura no nível de agora. */
  maxCircle: number;
  /** Nível da classe em que cada círculo abre ("a partir do nível N"). */
  opensAt: Record<number, number>;
  onToggle: (spell: { _id: string; name: string; circle: number }) => void;
}

export interface ITalentChoice {
  kind: 'talents';
  options: ITalentOption[];
  level: number;
  className: string;
  slots?: ITalentSlots;
  /** `key` → quantas vezes já foi pego (rascunho incluído). */
  taken: Record<string, number>;
  /** Vagas livres, por tipo. */
  open: { general: number; class: number };
  /** Nível em que a escolha entra na ficha. */
  at: number;
  onPick: (option: ITalentOption) => void;
}
