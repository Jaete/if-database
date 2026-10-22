import { Document } from 'mongoose';

/**
 * Uma linha da tabela de progressão da classe.
 *
 * As colunas variam de classe para classe — medidas nos 20 tópicos do fórum,
 * vão de 3 a 6, e a coluna de características aparece na 3ª posição no
 * espadachim e na 6ª no bardo. Por isso só os campos abaixo são nomeados; o
 * que for específico de uma classe ("Jingles", "Ataques Extras", "Ataque
 * Furtivo", "Invocar Criaturas") entra em `columns`, preservado em vez de
 * descartado.
 */
/**
 * Uma opção dentro do que um nível concede.
 *
 * `requiresPrerequisite` marca o `*` da ficha do fórum: a habilidade só pode
 * ser escolhida por quem cumpre um requisito, descrito nela própria. Quem não
 * cumpre fica com a outra opção do grupo.
 */
export interface IClassGrantOption {
  name: string;
  requiresPrerequisite?: boolean;
}

/**
 * O que um nível concede, já resolvido entre garantido e escolha.
 *
 * A célula da tabela é uma gramática, não uma lista: "+" separa concessões
 * independentes e "ou" liga mais forte que "+". Então
 * "Marca + Localização de Armadilhas ou Ataque Furtivo" concede Marca e UMA
 * entre as outras duas — e não três coisas.
 *
 * Uma opção só significa concessão garantida; duas ou mais, escolha.
 */
export interface IClassGrant {
  options: IClassGrantOption[];
}

export interface IClassLevel {
  level: number;
  proficiencyBonus?: number;
  cantripsKnown?: number;
  /** Índice 0 = 1º círculo. Derivado da célula "4 (1º) / 3 (2º) / 2 (3º)". */
  spellSlots?: number[];
  /** A célula original dos slots, para auditar o parser. */
  spellSlotsRaw?: string;
  /** O que o nível concede, com as escolhas preservadas. */
  grants?: IClassGrant[];
  /**
   * Os nomes em lista plana, para busca e para casar com as descrições.
   * Derivado de `grants`.
   */
  features?: string[];
  /** "+2 em um atributo ou +1 em dois atributos ou um Talento". */
  abilityScoreIncrease?: string;
  /** Colunas específicas da classe, por rótulo original. */
  columns?: Record<string, string>;
}

/**
 * Uma tabela dentro da descrição de uma característica ou talento.
 *
 * Algumas habilidades trazem tabelas próprias (a "Forma de Enxame" do druida
 * lista o custo em níveis de cada tipo de enxame). Achatá-las em texto perdia
 * a relação entre as colunas.
 *
 * A posição é preservada: a descrição carrega um marcador `[[tabela:N]]` onde
 * a tabela estava, porque costuma haver texto antes E depois dela.
 */
export interface IFeatureTable {
  headers?: string[];
  rows: string[][];
}

export interface IClassFeature {
  name: string;
  level?: number;
  description?: string;
  tables?: IFeatureTable[];
}

export interface IArchetype {
  name: string;
  /** Único dentro da classe, não globalmente. */
  slug: string;
  description?: string;
  features?: IClassFeature[];
}

/**
 * Um item de uma lista própria da classe.
 *
 * Não é talento nem característica: é uma opção da lista, com o nome e o
 * texto do que ela faz.
 */
export interface IClassCatalogItem {
  name: string;
  description?: string;
  tables?: IFeatureTable[];
}

/**
 * Lista própria da classe.
 *
 * Nem talento, nem característica, nem arquétipo. "Artes Divinas" é o caso
 * confirmado: a classe tem a lista, e quem sobe de nível escolhe itens dela.
 * O nome e a descrição são da lista; `items` é o que se escolhe.
 */
export interface IClassCatalog {
  name: string;
  /** Único dentro da classe, não globalmente. */
  slug: string;
  description?: string;
  items?: IClassCatalogItem[];
}

export interface ITalent {
  name: string;
  /** O que vinha depois de "– Requer ". */
  requirement?: string;
  description?: string;
  tables?: IFeatureTable[];

  /**
   * A lista a que o talento pertence, quando ele veio de uma.
   *
   * "Talentos Avançados de Necromancia" e companhia são conjuntos com regra
   * própria de destrave, diagramados dentro da seção de arquétipos do tópico.
   * Não são arquétipos: ninguém os escolhe como subclasse.
   */
  group?: string;
  /** A regra de destrave da lista, copiada do cabeçalho dela. */
  unlock?: string;
  /** O `*` do fórum: o talento altera a conjuração de quem o pega. */
  affectsSpellcasting?: boolean;
}

export interface IClassProficiencies {
  armor?: string;
  weapons?: string;
  tools?: string;
  savingThrows?: string;
  skills?: string;
  /** O bloco original, quando a estruturação erra. */
  raw?: string;
}

/**
 * Uma classe de personagem — o preset do que se adquire a cada nível.
 *
 * Arquétipos e talentos ficam aninhados: são sempre lidos junto da classe e
 * não são compartilhados entre classes, então uma coleção própria não
 * compraria nada. Os subdocumentos não têm `_id` e são endereçados por slug,
 * porque um `_id` de subdocumento seria regerado a cada reimportação — que é
 * justamente o problema que o slug existe para evitar.
 */
/**
 * O texto que o parser extraiu mas a conferência recusou.
 *
 * A importação só confia no texto quando a maior parte do que a TABELA anuncia
 * aparece descrita — é a única medida objetiva de qualidade que existe, e em
 * três dos vinte tópicos ela fica abaixo do limite. Antes, nesses casos, tudo
 * o que o parser achou era descartado e só sobrava o texto cru numa string
 * gigante, boa para ninguém.
 *
 * Isto é o meio-termo: o que foi extraído fica guardado, estruturado e
 * separado do que a classe de fato publica, esperando alguém olhar e decidir.
 * Não entra na classe sozinho, e não se perde.
 */
export interface IClassCandidate {
  /** Por que não entrou direto, em português, para quem for avaliar. */
  reason: string;
  /** Fração do que a tabela anuncia que apareceu descrito, de 0 a 1. */
  coverage: number;
  features?: IClassFeature[];
  archetypes?: IArchetype[];
  talents?: ITalent[];
  parsedAt?: Date;
}

/**
 * Qual o papel semântico deste bloco de conteúdo.
 *
 * - `unknown`           → o parser não soube classificar; preservado como raw.
 * - `obs`              → nota/aviso do autor ("OBS: níveis com + e ou...").
 * - `spellList`        → lista de magias embutida no tópico (ex.: Clérigo).
 * - `domainFeature`    → habilidade de domínio/divindade, não de nível.
 * - `nestedProgression`→ tabela de progressão de um companheiro/avatar.
 */
export type ContentBlockKind =
  'unknown' | 'obs' | 'spellList' | 'domainFeature' | 'nestedProgression';

/**
 * Bloco de conteúdo que o parser não soube encaixar nas coleções semânticas
 * (`features`, `archetypes`, `talents`, `levels`), mas que não pode se perder.
 *
 * `post` e `sourceHint` garantem rastreabilidade: quem quiser conferir o que
 * o parser encontrou tem índice de onde procurar no tópico original.
 */
export interface IContentBlock {
  kind: ContentBlockKind;
  title?: string;
  content: string;
  /** Índice da mensagem do tópico (0-indexed) em que o bloco apareceu. */
  post?: number;
  /** Breve descrição de onde veio, para diagnóstico humano. */
  sourceHint?: string;
  /** Tabelas que estavam dentro do bloco. */
  tables?: IFeatureTable[];
}

export interface ICharacterClass extends Document {
  name: string;
  slug: string;

  /**
   * Variantes do nome como aparecem no texto livre de `Spell.classes`.
   *
   * É dado manual, editável pela interface, e é o que resolve as grafias que o
   * normalizador não alcança. Por isso a importação nunca o sobrescreve.
   */
  aliases?: string[];

  description?: string;

  hitDie?: string;
  hpAtFirstLevel?: string;
  hpPerLevel?: string;

  proficiencies?: IClassProficiencies;
  startingEquipment?: string[];

  levels?: IClassLevel[];
  features?: IClassFeature[];
  archetypes?: IArchetype[];
  talents?: ITalent[];
  /** Listas próprias da classe, como Artes Divinas. Não são talentos. */
  catalogs?: IClassCatalog[];

  /** Derivado: a tabela trouxe truques ou slots de magia. */
  isSpellcaster?: boolean;

  /**
   * Classe única: no máximo um personagem no mundo inteiro pode tê-la.
   *
   * Não guarda quem é o dono. O dono é derivado — quem tiver `classId`
   * apontando para cá — porque o vínculo já existe e duplicá-lo criaria duas
   * verdades que precisariam ser sincronizadas a cada ficha apagada, cada
   * personagem morto e cada troca de classe.
   */
  isUnique?: boolean;

  sourceUrl?: string;
  importedAt?: Date;

  /** Trechos que o parser não soube classificar. Existe para o import nunca
   *  perder dado em silêncio. */
  unparsedSections?: string[];

  /**
   * Blocos de conteúdo estruturados que não cabem em `features`, `archetypes`
   * nem `talents` mas que não podem ser descartados.
   *
   * Exemplos: listas de magias embutidas no tópico do Clérigo, OBS do Ladrão
   * explicando a gramática `ou`/`+`/`*`, tabela de progressão do Espectro
   * do Invocador.
   */
  contentBlocks?: IContentBlock[];

  /**
   * O que a importação extraiu mas não confiou. Ver `IClassCandidate`.
   *
   * `null` é valor de escrita, não de leitura: é assim que a interface e a
   * reimportação apagam um candidato já avaliado. `undefined` seria ignorado
   * pelo Mongoose e o candidato velho sobreviveria.
   */
  candidate?: IClassCandidate | null;
}

export default ICharacterClass;
