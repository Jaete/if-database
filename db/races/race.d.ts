import { Document } from 'mongoose';

/**
 * Raças lidas dos tópicos de /f27-racas.
 *
 * `IRaceData` é o que o parser (`services/raceTopic.service.ts`) devolve;
 * `IRace` é o documento gravado (`db/races/schema.ts`).
 */

/**
 * Uma imagem da raça ou da sub-raça.
 *
 * `focus` é o ponto que o recorte preserva — o `object-position` do CSS,
 * ex.: "70% 30%". A mesma arte vira card em retrato, hero em paisagem e
 * faixa estreita na sub-raça, e cada recorte corta um pedaço diferente; sem
 * o foco, a figura principal some em algum deles. Ausente = centro.
 */
export interface IRaceImage {
  url: string;
  focus?: string;
}

/** Uma habilidade racial — "**Super Salto:** Por possuirem pernas...". */
export interface IRaceTrait {
  name: string;
  description: string;
  /**
   * Opções de uma habilidade que manda escolher uma entre várias. Ex.:
   * "Chamado da Constelação" do Elfo Estelar, que termina em "escolha uma das
   * opções:" e lista "Guia das Estrelas" e "Luz Cintilante" logo abaixo.
   */
  options?: IRaceTrait[];
}

/**
 * O que raça e sub-raça têm em comum.
 *
 * Na sub-raça, um campo preenchido SOBRESCREVE o da raça (o Deslocamento do
 * Fornbardun, a Tendência dos Pixies) e um campo vazio herda. O incremento de
 * atributo é a exceção que só a leitura resolve: nos Yokais a sub-raça SOMA ao
 * da raça; nos Elfos a raça dá Destreza e cada variante soma outro atributo.
 * Por isso o texto fica como está, sem tentar calcular o total.
 */
export interface IRaceProfile {
  /** "Origens e História" na raça, "História" na sub-raça. */
  history?: string;
  /** "Comportamento Geral". */
  behavior?: string;
  /** "Características Físicas". */
  physical?: string;

  /** "Incremento no Valor de Habilidade" / "Aumento no Valor de Atributo". */
  abilityScoreIncrease?: string;
  age?: string;
  /** "Tendência". */
  alignment?: string;
  size?: string;
  /** "Deslocamento". */
  speed?: string;
  languages?: string;

  traits: IRaceTrait[];
  /** Texto solto que não pertence a nenhum campo — introduções de seção. */
  notes?: string[];
}

/**
 * Uma regra de escolha da raça mista (Mestiço).
 *
 * - `hybridHeritage` ("Herança Híbrida"): escolha `count` habilidades entre
 *   as das raças de origem.
 * - `dominantBlood` ("Sangue Forte"): escolha a raça de origem dominante e
 *   ganhe as habilidades em comum dela — as que valem para todas as
 *   sub-raças, nunca as de uma sub-raça só.
 *
 * `name` e `description` são o texto do tópico, para a página da raça
 * mostrar a regra como o fórum escreve.
 */
export interface IRaceChoiceRule {
  kind: 'hybridHeritage' | 'dominantBlood';
  name: string;
  description: string;
  count?: number;
}

export interface ISubrace extends IRaceProfile {
  name: string;
  slug: string;
  /**
   * O cabeçalho que agrupa a sub-raça, quando o tópico tem mais de um grupo.
   * Só os Yokais têm: "Sub-raças de Yokai" (Caninos, Felinos, Equinos,
   * Bovinos) e depois outro "Sub-raças" (Nagascale, Aquavista).
   */
  group?: string;
  image?: IRaceImage;
}

export interface IRaceData extends IRaceProfile {
  name: string;
  slug: string;
  /** "[Raça única]" no título do tópico. */
  unique: boolean;
  /**
   * A frase de apresentação no topo da página da raça. Escrita na edição;
   * o tópico não tem esse campo. Vazio = o topo usa o primeiro parágrafo
   * de `history`.
   */
  summary?: string;
  /**
   * A primeira é a capa — fundo do card na listagem e do hero no detalhe; as
   * outras, a galeria. Fora as imagens que pertencem a uma sub-raça.
   */
  images: IRaceImage[];
  /**
   * Habilidades da raça base que a própria raça diz NÃO passarem às
   * sub-raças — "Habilidades da raça base das Fadas (não se mistura com as
   * sub-raças)". Valem para quem é da raça sem escolher sub-raça.
   */
  baseOnlyTraits?: IRaceTrait[];
  subraces: ISubrace[];
  /**
   * Regras que o tópico escreve como habilidade mas que, na ficha, são uma
   * ESCOLHA — o personagem não ganha "Herança Híbrida", ganha as duas
   * habilidades que escolheu com ela. Hoje só o Mestiço tem. Ficam fora de
   * `traits` para a ficha nunca as conceder como habilidade.
   */
  choiceRules?: IRaceChoiceRule[];
  sourceUrl?: string;
  /**
   * O que o parser leu mas não soube encaixar. Serve para auditar o import:
   * uma raça com aviso precisa de olho humano antes de ir para o banco.
   */
  warnings: string[];
}

/**
 * O documento gravado. Os avisos do parser não são gravados: eles servem
 * para auditar uma importação e voltam no resultado dela, não na raça.
 */
export interface IRace extends Omit<IRaceData, 'warnings'>, Document {
  importedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IRace;
