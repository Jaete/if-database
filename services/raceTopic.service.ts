import type {
  IRaceChoiceRule,
  IRaceData,
  IRaceProfile,
  IRaceTrait,
  ISubrace,
} from '../db/races/race.d';
import { classSlug } from '../db/l10n/classes';
import {
  BOLD_CLOSE,
  BOLD_OPEN,
  classPostBodies,
  classTopicLines,
} from './classTopic.service';
import { foldKeepingLength } from './spellTopic.service';

/**
 * Lê um tópico de raça do fórum (ex.: "Lapinara") e devolve a raça inteira,
 * com as sub-raças dentro.
 *
 * Calibrado contra os 13 tópicos de /f27-racas. Dois templates convivem ali,
 * os mesmos das classes: o texto corrido num post só, e o template de abas
 * (`.text-block`, com uma imagem de galeria por aba) — Draconatos, Moogles e
 * Elfo Estelar. A gramática do conteúdo é idêntica nos dois; o template só
 * muda onde as imagens ficam e acrescenta a navegação "Anterior / Próximo".
 *
 * A linearização (HTML → linhas com o negrito marcado) é a do parser de
 * classe, de propósito: é o mesmo fórum e a mesma diagramação, e duas
 * gramáticas para o mesmo HTML divergiriam na primeira correção.
 *
 * Diferente da classe, aqui não há tabela nem spoiler — a estrutura inteira
 * está nos rótulos em negrito. O que separa os casos é:
 *   - "**Rótulo:** texto" → campo conhecido (Idade, Tendência...) ou habilidade;
 *   - "**Rótulo:**" sozinho → cabeçalho de seção, nome de sub-raça, ou nome de
 *     habilidade cuja descrição vem na linha de baixo (Elfo Estelar). Só a
 *     linha SEGUINTE desempata — ver `openBareLabel`.
 */

const IMAGE_MARK = '\u0000I';

/** Rótulo → campo de `IRaceProfile`. Casado sobre o rótulo já dobrado. */
const FIELD_ALIASES: {
  match: (folded: string) => boolean;
  key: keyof IRaceProfile;
}[] = [
  {
    match: (l) =>
      ['origens e historia', 'origem', 'origens', 'historia'].includes(l),
    key: 'history',
  },
  { match: (l) => l.startsWith('comportamento'), key: 'behavior' },
  { match: (l) => l.startsWith('caracteristicas fisicas'), key: 'physical' },
  {
    // "Incremento no Valor de Habilidade" é o rótulo do template; Elfos
    // escreve "Aumento no Valor de Atributo".
    match: (l) =>
      l.startsWith('incremento no valor') || l.startsWith('aumento no valor'),
    key: 'abilityScoreIncrease',
  },
  { match: (l) => l === 'idade', key: 'age' },
  { match: (l) => l === 'tendencia', key: 'alignment' },
  { match: (l) => l === 'tamanho', key: 'size' },
  { match: (l) => l === 'deslocamento', key: 'speed' },
  { match: (l) => l === 'idiomas', key: 'languages' },
];

type TextField = Exclude<keyof IRaceProfile, 'traits' | 'notes'>;

/**
 * Rótulos sem negrito que ainda assim são campo. Mestiços escreve
 * "Tendência:" e "Deslocamento:" em texto normal, e Elfos escreve
 * "Deslocamento:" sozinho numa linha. Fora desta lista, um "Algo:" sem
 * negrito é prosa — "Exemplo: Percorreu 6 metros" não é campo.
 */
const PLAIN_FIELD_LABELS = new Set([
  'idade',
  'tendencia',
  'tamanho',
  'deslocamento',
  'idiomas',
]);

/**
 * Sub-rótulos de "Características Físicas" nos Yokais: "**Altura:** Varia
 * entre 1,50m e 1,80m". Sem isto, cada um virava uma habilidade racial.
 */
const PHYSICAL_SUBLABELS = new Set([
  'altura',
  'expectativa de vida',
  'aparencia',
]);

const isSubraceHeader = (folded: string) =>
  /^(sub-?racas?|variantes?)\b/.test(folded);

/**
 * "Traços Raciais", "Habilidades em comum", "Habilidades Passivas (válido
 * para todas as sub-raças)", "Habilidade Passiva", "Habilidades Raciais"...
 * O nome varia em todo tópico; a família de rótulo não.
 */
const isTraitsHeader = (folded: string) =>
  folded.startsWith('tracos raciais') || folded.startsWith('habilidade');

/** "Habilidades da raça base das Fadas (não se mistura com as sub-raças)". */
const isBaseOnlyHeader = (folded: string) =>
  folded.includes('raca base') || folded.includes('nao se mistura');

/** Habilidade que termina mandando escolher: as seguintes são opções dela. */
const OPENS_OPTIONS = /(opcoes|escolha|seguintes)[^.]*:$/;

/** "[Raça única]" no título é qualificação, não nome. */
const UNIQUE_IN_TITLE = /[[(]?\s*ra[çc]a\s+[úu]nica\s*[\])]?/i;

const foldLabel = (text: string) =>
  foldKeepingLength(text).replace(/\s+/g, ' ').replace(/:$/, '').trim();

const stripMarks = (text: string) =>
  text.split(BOLD_OPEN).join('').split(BOLD_CLOSE).join('').trim();

type Token =
  | { kind: 'blank' }
  | { kind: 'image'; url: string }
  | { kind: 'label'; label: string; text: string; bold: boolean }
  | { kind: 'prose'; text: string };

/** Navegação do template de abas que sobra como texto. */
const isTabChrome = (line: string) =>
  /^(anterior|pr[óo]ximo)$/i.test(line) || /^\d+\s*\/\s*\d+$/.test(line);

/**
 * Uma linha do fluxo → token.
 *
 * O rótulo é o negrito do COMEÇO da linha terminado em dois-pontos. Elfos
 * escreve "**Prioridade Magica**:" com os dois-pontos fora do negrito, por
 * isso o resto também é olhado. Negrito no começo sem dois-pontos e com
 * texto depois é prosa enfatizada, não rótulo.
 */
function tokenize(line: string): Token | null {
  if (!line) return { kind: 'blank' };
  if (line.startsWith(IMAGE_MARK)) {
    return { kind: 'image', url: line.slice(IMAGE_MARK.length).trim() };
  }
  if (isTabChrome(line)) return null;

  if (line.startsWith(BOLD_OPEN)) {
    const close = line.indexOf(BOLD_CLOSE);
    const bold = line.slice(BOLD_OPEN.length, close).trim();
    const rest = stripMarks(line.slice(close + BOLD_CLOSE.length));
    if (bold) {
      if (bold.endsWith(':')) {
        return {
          kind: 'label',
          label: bold.slice(0, -1).trim(),
          text: rest,
          bold: true,
        };
      }
      if (rest.startsWith(':')) {
        return {
          kind: 'label',
          label: bold,
          text: rest.slice(1).trim(),
          bold: true,
        };
      }
      if (!rest) return { kind: 'label', label: bold, text: '', bold: true };
    }
    return { kind: 'prose', text: stripMarks(line) };
  }

  const plain = /^([^:]{3,40}):\s*(.*)$/.exec(line);
  if (plain && PLAIN_FIELD_LABELS.has(foldLabel(plain[1]))) {
    return {
      kind: 'label',
      label: plain[1].trim(),
      text: stripMarks(plain[2]),
      bold: false,
    };
  }
  return { kind: 'prose', text: stripMarks(line) };
}

/**
 * Junta uma linha ao texto que já existe.
 *
 * O Moogles quebra a linha no meio da frase ("...mas que" / "se espalhou
 * pelo mundo"); os outros tópicos quebram entre parágrafos. Linha anterior
 * terminada em pontuação, ou separada por linha em branco, abre parágrafo;
 * o resto é a mesma frase continuando.
 */
function appendText(
  existing: string | undefined,
  add: string,
  blankBefore: boolean
) {
  if (!add) return existing ?? '';
  if (!existing) return add;
  const newParagraph = blankBefore || /[.!?;:)"”]$/.test(existing);
  return existing + (newParagraph ? '\n\n' : ' ') + add;
}

/**
 * Prepara o HTML do post para a linearização.
 *
 * As imagens viram linhas-marcador na posição em que aparecem, porque a
 * posição é o que diz de quem é a imagem: logo depois de "**Velóridas:**" é
 * a da sub-raça. No template de abas a galeria fica separada do texto, no
 * topo; cada `.text-block` aponta a sua por `data-image-id`, e o marcador vai
 * para o começo do bloco — assim os dois templates chegam iguais ao parser.
 */
export function prepareHtml(post: string): string {
  const section = post.search(/<div class="image-section"/);
  const text = post.search(/<div class="text-section"/);
  let html = post;

  if (section !== -1 && text > section) {
    const gallery = [
      ...post.slice(section, text).matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi),
    ].map((m) => m[1]);
    html =
      post.slice(0, section) +
      post
        .slice(text)
        .replace(
          /(<div class="text-block[^"]*"[^>]*\bdata-image-id="(\d+)"[^>]*>)/g,
          (open: string, _o: string, id: string) =>
            gallery[Number(id)]
              ? `${open}\n${IMAGE_MARK}${gallery[Number(id)]}\n`
              : open
        );
  }

  return html
    .replace(/<button\b[\s\S]*?<\/button>/gi, '')
    .replace(/<span id="textCounter"[\s\S]*?<\/span>/gi, '')
    .replace(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi, (_m, src: string) =>
      // Emoticons do fórum não são arte da raça.
      /\/smiles?\/|illiweb\.com/i.test(src) ? '' : `\n${IMAGE_MARK}${src}\n`
    );
}

function raceNameFromTopic(html: string, url?: string) {
  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '';
  const raw = title.split('|')[0].replace(/\s+/g, ' ').trim();
  const name = raw
    .replace(UNIQUE_IN_TITLE, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (name) return { name, unique: UNIQUE_IN_TITLE.test(raw) };
  const slug = url ? (/\/t\d+-(.+?)(?:$|\?|#)/.exec(url)?.[1] ?? '') : '';
  return {
    name: decodeURIComponent(slug).replace(/-/g, ' ').trim() || 'Raça',
    unique: false,
  };
}

const emptyProfile = (): IRaceProfile => ({ traits: [] });

const NUMBER_WORDS: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
};

/**
 * Habilidades que, na ficha, são escolha — ver `IRaceChoiceRule`.
 *
 * Reconhecidas pelo nome, não pela raça: se outra raça mista aparecer no
 * fórum escrevendo "Herança Híbrida" ou "Sangue Forte", ela já sai certa.
 */
const CHOICE_RULES: {
  match: (folded: string) => boolean;
  kind: IRaceChoiceRule['kind'];
}[] = [
  { match: (n) => n.startsWith('heranca hibrida'), kind: 'hybridHeritage' },
  { match: (n) => n.startsWith('sangue forte'), kind: 'dominantBlood' },
];

/** Move as regras de escolha de `traits` para `choiceRules`. */
function extractChoiceRules(race: IRaceData) {
  const rules: IRaceChoiceRule[] = [];
  race.traits = race.traits.filter((trait) => {
    const kind = CHOICE_RULES.find(({ match }) =>
      match(foldLabel(trait.name))
    )?.kind;
    if (!kind) return true;

    const rule: IRaceChoiceRule = {
      kind,
      name: trait.name,
      description: trait.description,
    };
    if (kind === 'hybridHeritage') {
      // "Você pode escolher dois traços raciais..."
      const word = /escolher\s+(\d+|[a-z]+)/.exec(
        foldKeepingLength(trait.description)
      )?.[1];
      const count = word ? Number(word) || NUMBER_WORDS[word] : undefined;
      if (count) {
        rule.count = count;
      } else {
        rule.count = 2;
        race.warnings.push(
          `"${trait.name}": não achei quantas habilidades escolher; assumi 2.`
        );
      }
    }
    rules.push(rule);
    return false;
  });
  if (rules.length) race.choiceRules = rules;
}

const hasContent = (p: IRaceProfile) =>
  p.traits.length > 0 ||
  (p.notes?.length ?? 0) > 0 ||
  FIELD_ALIASES.some(({ key }) => !!p[key as TextField]);

/** Lê o tópico de uma raça. Não toca o banco. */
export function parseRaceTopic(html: string, sourceUrl?: string): IRaceData {
  const { name, unique } = raceNameFromTopic(html, sourceUrl);
  const race: IRaceData = {
    ...emptyProfile(),
    name,
    slug: classSlug(name),
    unique,
    images: [],
    subraces: [],
    sourceUrl,
    warnings: [],
  };

  const posts = classPostBodies(html);
  if (posts.length === 0) {
    race.warnings.push('Nenhuma mensagem encontrada no tópico.');
    return race;
  }
  // Os 13 tópicos de raça têm um post só. Respostas, se aparecerem, são
  // comentário de jogador, não conteúdo da raça.
  if (posts.length > 1) {
    race.warnings.push(
      `O tópico tem ${posts.length} mensagens; só a primeira foi lida.`
    );
  }

  const tokens = classTopicLines(prepareHtml(posts[0]))
    .map(tokenize)
    .filter((t): t is Token => t !== null);

  /** Onde o texto solto que vier a seguir vai parar. */
  type Target =
    | { kind: 'field'; key: TextField }
    | { kind: 'trait'; trait: IRaceTrait }
    | { kind: 'notes' };

  let entity: IRaceProfile = race;
  let subrace: ISubrace | null = null;
  let target: Target = { kind: 'notes' };
  let inSubraceSection = false;
  let group: string | undefined;
  let baseOnly = false;
  let optionsOf: IRaceTrait | null = null;
  let blankBefore = false;
  const pendingImages: string[] = [];

  const flushImages = () => {
    race.images.push(...pendingImages.splice(0).map((url) => ({ url })));
  };

  const nextMeaningful = (from: number) => {
    for (let j = from; j < tokens.length; j++) {
      const t = tokens[j];
      if (t.kind !== 'blank' && t.kind !== 'image') return t;
    }
    return null;
  };

  const pushTrait = (trait: IRaceTrait) => {
    if (optionsOf) {
      (optionsOf.options ??= []).push(trait);
      return;
    }
    if (baseOnly && entity === race) {
      (race.baseOnlyTraits ??= []).push(trait);
    } else {
      entity.traits.push(trait);
    }
  };

  const openSubrace = (subraceName: string) => {
    // Dois nomes que viram o mesmo slug (o mesmo nome em grupos diferentes)
    // não podem dividir a chave: a edição, a URL `?sub=` e a preservação de
    // imagens na reimportação casam a sub-raça pelo slug.
    const base = classSlug(subraceName);
    let slug = base;
    for (let n = 2; race.subraces.some((s) => s.slug === slug); n++) {
      slug = `${base}-${n}`;
    }
    subrace = {
      ...emptyProfile(),
      name: subraceName,
      slug,
      group,
    };
    if (pendingImages.length) {
      subrace.image = { url: pendingImages.pop()! };
      flushImages();
    }
    race.subraces.push(subrace);
    entity = subrace;
    target = { kind: 'notes' };
    baseOnly = false;
    optionsOf = null;
  };

  /**
   * "**Rótulo:**" sozinho na linha, que não é campo nem cabeçalho conhecido.
   *
   * Se o que vem depois é prosa, é uma habilidade com a descrição na linha
   * de baixo (o Elfo Estelar inteiro é assim). Se vem outro rótulo, é nome:
   * de sub-raça, dentro da seção de sub-raças; fora dela, um cabeçalho que o
   * parser não conhece — vira aviso em vez de habilidade sem descrição.
   */
  const openBareLabel = (label: string, index: number) => {
    const next = nextMeaningful(index + 1);
    if (next?.kind === 'prose') {
      flushImages();
      optionsOf = null;
      const trait: IRaceTrait = { name: label, description: '' };
      pushTrait(trait);
      target = { kind: 'trait', trait };
      return;
    }
    if (inSubraceSection) {
      openSubrace(label);
      return;
    }
    flushImages();
    // O tópico dos Mestiços abre repetindo o nome da raça no singular
    // ("**Mestiço:**") antes de qualquer conteúdo. É título, não seção.
    if (!hasContent(race) && race.slug.startsWith(classSlug(label))) {
      target = { kind: 'notes' };
      return;
    }
    race.warnings.push(`Cabeçalho não reconhecido: "${label}".`);
    target = { kind: 'notes' };
  };

  tokens.forEach((token, index) => {
    if (token.kind === 'blank') {
      blankBefore = true;
      return;
    }

    if (token.kind === 'image') {
      // Imagem logo depois do nome da sub-raça, antes de qualquer texto dela.
      if (subrace && !subrace.image && !hasContent(subrace)) {
        subrace.image = { url: token.url };
      } else {
        pendingImages.push(token.url);
      }
      return;
    }

    const wasBlank = blankBefore;
    blankBefore = false;

    if (token.kind === 'prose') {
      flushImages();
      if (target.kind === 'field') {
        entity[target.key] = appendText(
          entity[target.key],
          token.text,
          wasBlank
        );
      } else if (target.kind === 'trait') {
        target.trait.description = appendText(
          target.trait.description,
          token.text,
          wasBlank
        );
        if (
          !optionsOf &&
          OPENS_OPTIONS.test(foldKeepingLength(target.trait.description))
        ) {
          optionsOf = target.trait;
        }
      } else {
        (entity.notes ??= []).push(token.text);
      }
      return;
    }

    const folded = foldLabel(token.label);

    // Cabeçalhos só contam sem texto na frente: "**Habilidades:**" abre a
    // seção, "**Habilidade X:** descrição" seria uma habilidade.
    if (!token.text && isSubraceHeader(folded)) {
      inSubraceSection = true;
      group = token.label;
      target = { kind: 'notes' };
      optionsOf = null;
      return;
    }
    if (!token.text && isTraitsHeader(folded)) {
      baseOnly = isBaseOnlyHeader(folded);
      target = { kind: 'notes' };
      optionsOf = null;
      return;
    }

    // Um rótulo sozinho pode ser o NOME de uma sub-raça, e a imagem que veio
    // antes dele é dela — "Ancião" no template de abas. Quem decide é
    // `openBareLabel`; aqui só se esvazia quando o rótulo já é conteúdo.
    if (token.text || !token.bold) flushImages();

    if (
      target.kind === 'field' &&
      target.key === 'physical' &&
      PHYSICAL_SUBLABELS.has(folded)
    ) {
      entity.physical = appendText(
        entity.physical,
        `${token.label}: ${token.text}`,
        true
      );
      return;
    }

    const field = FIELD_ALIASES.find(({ match }) => match(folded))?.key as
      TextField | undefined;
    if (field) {
      optionsOf = null;
      if (token.text)
        entity[field] = appendText(entity[field], token.text, true);
      target = { kind: 'field', key: field };
      return;
    }

    if (!token.bold) {
      (entity.notes ??= []).push(`${token.label}: ${token.text}`);
      return;
    }

    if (!token.text) {
      openBareLabel(token.label, index);
      return;
    }

    const trait: IRaceTrait = { name: token.label, description: token.text };
    pushTrait(trait);
    // A descrição de uma opção pode continuar na linha de baixo, mas a opção
    // não abre opções próprias.
    target = { kind: 'trait', trait };
    if (!optionsOf && OPENS_OPTIONS.test(foldKeepingLength(token.text))) {
      optionsOf = trait;
    }
  });

  flushImages();

  extractChoiceRules(race);

  // O grupo só informa quando há mais de um. Na maioria das raças é sempre
  // "Sub-raças" ou "Variantes", e repetir isso em cada uma é ruído.
  const groups = new Set(race.subraces.map((s) => s.group));
  for (const s of race.subraces) {
    if (groups.size < 2) delete s.group;
  }

  const audit = (profile: IRaceProfile, who: string) => {
    const all = [
      ...profile.traits,
      ...(profile === race ? (race.baseOnlyTraits ?? []) : []),
    ];
    for (const t of all) {
      if (!t.description && !t.options?.length) {
        race.warnings.push(`${who}: habilidade "${t.name}" sem descrição.`);
      }
    }
  };
  audit(race, race.name);
  for (const s of race.subraces) {
    audit(s, s.name);
    if (!hasContent(s)) race.warnings.push(`Sub-raça "${s.name}" ficou vazia.`);
  }

  return race;
}
