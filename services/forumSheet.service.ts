import { parseCitizenSheetLines } from './citizenSheet.service';
import SKILLS, { findSkill } from '@/db/l10n/skills';
import { modifierOf, skillValue } from '@/lib/stats';

/**
 * Importa uma ficha de personagem a partir de um tópico do fórum.
 *
 * Em vez de escrever um segundo parser, o HTML do post é convertido em linhas
 * no mesmo dialeto do template de cidadão e entregue a `parseCitizenSheetLines`.
 * Duas coisas tornam isso possível: a ficha do fórum usa
 * `<strong>Rótulo:</strong> valor`, que vira `Rótulo: valor`; e a tabela de
 * atributos tem exatamente as seis colunas que o parser já espera, bastando
 * convertê-la em linhas de pipe.
 */

const FORUM_BASE =
  process.env.FORUM_ORIGIN || 'https://isekaifantasy.forumbrasil.net';

const FETCH_TIMEOUT_MS = 15_000;
// Uma página de tópico do fórum gira em torno de 100 KB; 2 MB é folga larga e
// ainda protege contra uma resposta absurda.
const MAX_BYTES = 2 * 1024 * 1024;

// Os títulos de seção da ficha do fórum não batem com os do template de
// cidadão. "Proficências" está com o erro de digitação que existe na ficha.
const SECTION_ALIASES: Record<string, string> = {
  'Proficências e Perícias': 'Proficiências',
  'Proficiências e Perícias': 'Proficiências',
  Magias: 'Conjuração de Magias',
  Inventário: 'Equipamento',
  'Habilidades e Características': 'Habilidades e Características',
  'Recursos Principais': 'Recursos Principais',
  Atributos: 'Atributos',
  Profissões: 'Profissões',
  Aparência: 'Aparência',
  História: 'História',
};

// Na ficha do fórum "Tamanho" é a altura do personagem, não o `size` de
// criatura; o template de cidadão chama isso de "Altura".
const LABEL_ALIASES: Record<string, string> = {
  Tamanho: 'Altura',
  Adoração: 'Adoração',
};

// Seções em que cada trecho em negrito é o nome de um item, e o texto que vem
// depois é a descrição dele. O parser do template espera esses itens na forma
// "### N. Nome" seguida de "**Descrição:**".
const ITEM_SECTIONS = new Set([
  'Habilidades e Características',
  'Profissões',
  'Conjuração de Magias',
]);

// Marca as linhas que vieram de <strong>. A informação se perde ao remover as
// tags, mas é ela que distingue o nome de uma habilidade do corpo dela.
const BOLD = '\u0000B';

export class ForumSheetError extends Error {}

/** A ficha não segue o modelo o bastante para ser lida com segurança. */
export class UnrecognizedSheetError extends ForumSheetError {}

// Quantas seções do modelo precisam aparecer para a ficha ser considerada
// legível. Abaixo disso é melhor abrir o formulário em branco do que preencher
// com algo que veio de um layout diferente demais.
const MIN_SECTIONS = 3;

// Texto entre parênteses no modelo é instrução para quem preenche
// ("(Insira o nome do seu personagem.)"), não valor.
const PLACEHOLDER = /^\(.*\)$/;

const BULLET = /^[•\-*]\s*/;

/** Recusa qualquer URL que não seja um tópico do próprio fórum. */
export function parseTopicUrl(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new ForumSheetError('URL inválida.');
  }

  const base = new URL(FORUM_BASE);
  if (url.origin !== base.origin) {
    throw new ForumSheetError(
      `Só é possível importar fichas de ${base.origin}.`
    );
  }
  if (!/^\/t\d+/.test(url.pathname)) {
    throw new ForumSheetError(
      'A URL precisa ser a de um tópico do fórum (ex.: /t365-ficha-wesker).'
    );
  }

  // O fragmento (#3128) aponta para uma mensagem, mas a página devolvida é a
  // mesma; descartar evita uma requisição diferente à toa.
  return `${url.origin}${url.pathname}${url.search}`;
}

async function fetchTopicHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'if-database sheet importer' },
    });
    if (!res.ok) {
      throw new ForumSheetError(
        `O fórum respondeu ${res.status} para esse tópico.`
      );
    }

    const html = await res.text();
    if (html.length > MAX_BYTES) {
      throw new ForumSheetError('A página do tópico é grande demais.');
    }
    return html;
  } catch (error) {
    if (error instanceof ForumSheetError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ForumSheetError('O fórum demorou demais para responder.');
    }
    throw new ForumSheetError('Não foi possível acessar o fórum.');
  } finally {
    clearTimeout(timer);
  }
}

/** Recorta o corpo do primeiro post: `postbody` → `content clearfix`. */
export function extractPostBody(html: string): string {
  const postIndex = html.indexOf('class="postbody"');
  if (postIndex === -1) {
    throw new ForumSheetError('Não encontrei nenhuma mensagem nesse tópico.');
  }

  const fromPost = html.slice(postIndex);
  const contentIndex = fromPost.search(/<div[^>]*class="content[^"]*"/i);
  if (contentIndex === -1) {
    throw new ForumSheetError('Não encontrei o corpo da ficha nesse tópico.');
  }

  // Conta a profundidade das <div> para achar o fim real do post. Cortar no
  // próximo "postbody" não serve: quando a ficha é a última mensagem, o corte
  // levaria junto a barra lateral e o rodapé da página — era daí que vinha o
  // "Admin" grudado no fim da história.
  const rest = fromPost.slice(contentIndex);
  const tag = /<div\b[^>]*>|<\/div>/gi;
  let depth = 0;
  let match: RegExpExecArray | null;

  while ((match = tag.exec(rest)) !== null) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return rest.slice(0, match.index);
  }

  // HTML desbalanceado: melhor devolver o que há do que falhar.
  return rest;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;|&#8195;|&#8194;|&ensp;|&emsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, '&');
}

/** Converte `<table>` em linhas de pipe, que o parser já sabe ler. */
function tablesToPipeRows(html: string): string {
  return html.replace(/<table[\s\S]*?<\/table>/gi, (table) => {
    const rows = table.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
    const lines = rows.map((row) => {
      const cells = (row.match(/<t[dh][\s\S]*?<\/t[dh]>/gi) ?? []).map((cell) =>
        decodeEntities(cell.replace(/<[^>]+>/g, '')).trim()
      );
      return `| ${cells.join(' | ')} |`;
    });
    return `\n${lines.join('\n')}\n`;
  });
}

/** HTML do post → linhas de texto no dialeto que o parser entende. */
export function htmlToSheetLines(html: string): string[] {
  let text = tablesToPipeRows(html);

  // Títulos de spoiler ("Detalhes:", "Lista Completa de Perícias:") são
  // controles da interface do fórum, não conteúdo da ficha.
  text = text.replace(/<dt[\s\S]*?<\/dt>/gi, '');

  // Rótulos em negrito viram "Rótulo: valor", a forma que o parser reconhece.
  text = text.replace(
    /<strong[^>]*>\s*([^<]+?)\s*:\s*<\/strong>/gi,
    (_, label) => `\n${BOLD}${label}: `
  );
  // Um <strong> sem dois-pontos costuma ser o nome de uma habilidade ou magia,
  // então vira uma linha própria para não se colar no parágrafo anterior.
  text = text.replace(
    /<strong[^>]*>([\s\S]*?)<\/strong>/gi,
    (_, body) => `\n${BOLD}${body}\n`
  );

  text = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(div|p|li|dd|dt|dl|tr|h\d)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<hr\s*\/?>/gi, '\n')
    // O conteúdo dos spoilers está no HTML e é parte da ficha; só as tags saem.
    .replace(/<[^>]+>/g, '');

  return (
    decodeEntities(text)
      .split('\n')
      // Restos de BBCode que o fórum não converteu, como um [i] solto.
      .map((line) => line.replace(/\[\/?[a-z]{1,10}\]/gi, ''))
      // Um &lt;div&gt; escapado vira "<div" só depois da decodificação, quando
      // as tags de verdade já saíram.
      .map((line) => line.replace(/<\/?[a-z][^>]*>?/gi, ''))
      .map((line) => {
        const bold = line.startsWith(BOLD);
        const clean = line
          .slice(bold ? BOLD.length : 0)
          .replace(/\s+/g, ' ')
          .trim();
        return clean ? `${bold ? BOLD : ''}${clean}` : '';
      })
      .filter(Boolean)
  );
}

/**
 * Traduz os títulos e rótulos da ficha do fórum para o vocabulário do template
 * e sintetiza o cabeçalho que falta.
 */
/**
 * Lê uma linha de perícia da ficha do fórum.
 *
 * Só interessa o nome e se está marcada como proficiente: os números variam
 * demais entre fichas — "(+4) (*)", "(Proficiente): + 2", ou nada — e o app
 * recalcula o valor a partir do atributo e do bônus de proficiência.
 *
 * O nome precisa estar no catálogo de perícias; qualquer outra linha do
 * spoiler (cabeçalhos de grupo, comentários) é descartada.
 */
export function parseSkillLine(
  raw: string
): { name: string; proficient: boolean } | null {
  const line = raw.replace(BULLET, '').trim();
  if (!line) return null;

  const skill = findSkill(line.split(/[(:]/)[0]);
  if (!skill) return null;

  // Os dois marcadores em uso hoje. Quem não marcou nada entra sem
  // proficiência e ajusta no check do formulário.
  const proficient = /\(\s*\*\s*\)|proficiente/i.test(line);

  return { name: skill.name, proficient };
}

export function normalizeSheetLines(lines: string[]): {
  lines: string[];
  sections: string[];
  skills: Array<{ name: string; proficient: boolean }>;
} {
  const out: string[] = [];
  const seen = new Set<string>();

  // O bloco de identidade do fórum não tem cabeçalho de seção, e sem ele o
  // parser não sabe onde guardar Nome, Idade e companhia.
  out.push('Informações Básicas');
  let section = 'Informações Básicas';
  let itemCount = 0;
  // Nem toda ficha põe o nome do item em negrito: a do Wesker escreve
  // "Sentido Espiritual: ..." em texto puro, a do Caine usa <strong>. Quando a
  // seção usa negrito ele manda; quando não usa, "Nome curto: texto" abre item.
  let sectionHasBold = false;
  // O bônus de proficiência aparece em "Recursos Principais", antes das
  // proficiências, e é o valor dos testes de resistência marcados na ficha.
  let proficiencyBonus = 2;
  const skills = new Map<string, boolean>();
  let inventoryStarted = false;
  const backpack: string[] = [];

  for (const raw of lines) {
    const bold = raw.startsWith(BOLD);
    const line = bold ? raw.slice(BOLD.length) : raw;

    const mapped = SECTION_ALIASES[line];
    if (mapped) {
      // O que foi juntando na mochila é despejado ao sair do inventário.
      if (section === 'Equipamento' && backpack.length > 0) {
        out.push(`Mochila: ${backpack.join('; ')}`);
        backpack.length = 0;
      }

      out.push(mapped);
      seen.add(mapped);
      section = mapped;
      itemCount = 0;
      sectionHasBold = false;

      // O parser só guarda Gil e Mochila dentro da sub-seção Inventário.
      if (mapped === 'Equipamento') {
        out.push('### Inventário');
        inventoryStarted = true;
      } else {
        inventoryStarted = false;
      }
      continue;
    }

    const match = line.match(/^([^:]{1,40}):\s*(.*)$/);

    if (ITEM_SECTIONS.has(section)) {
      if (bold) sectionHasBold = true;
      const startsItem =
        bold || (!sectionHasBold && !!match && match[1].trim().length <= 60);

      if (startsItem) {
        let name = match ? match[1].trim() : line;
        let rest = match ? match[2].trim() : '';

        // "Traço: Olhar Além do Agora" é um título inteiro, enquanto
        // "Prioridade Magica: A primeira magia..." é nome e descrição. O que
        // separa os dois é a pontuação final e o tamanho.
        if (bold && rest && rest.length <= 60 && !/[.!?]$/.test(rest)) {
          name = line;
          rest = '';
        }
        itemCount += 1;
        out.push(`### ${itemCount}. ${name}`);
        if (rest) out.push(`**Descrição:** ${rest}`);
        continue;
      }
      if (itemCount > 0) {
        out.push(`**Descrição:** ${line}`);
        continue;
      }
    }

    // ── Perícias ──
    // Não passam pela máquina de estados: o que se aproveita da ficha é só
    // quais estão marcadas como proficientes, e o valor é calculado depois.
    if (section === 'Proficiências' && BULLET.test(line)) {
      const skill = parseSkillLine(line);
      if (skill) {
        skills.set(skill.name, skills.get(skill.name) || skill.proficient);
        continue;
      }
    }

    // ── Itens do inventário ──
    if (section === 'Equipamento' && BULLET.test(line)) {
      backpack.push(line.replace(BULLET, '').trim());
      continue;
    }

    if (match) {
      const [, rawLabel, value] = match;
      const label = LABEL_ALIASES[rawLabel] ?? rawLabel;

      if (label === 'Bônus de Proficiência') {
        const parsed = value.match(/-?\d+/);
        if (parsed) proficiencyBonus = Number(parsed[0]);
      }

      // ── Testes de resistência ──
      // A ficha escreve "Testes de Resistência: Sabedoria, Carisma" numa linha
      // só; o parser espera uma tabela. Quem está listado é proficiente, então
      // o valor é o bônus de proficiência.
      if (section === 'Proficiências' && label === 'Testes de Resistência') {
        const attrs = value
          .split(/[,;]/)
          .map((a) => a.trim())
          .filter((a) => a && a !== '—' && a !== '-');

        if (attrs.length > 0) {
          out.push('### Testes de Resistência');
          // Reinicia a tabela para a próxima sub-seção não herdar esta.
          out.push('| Atributo | Valor |');
          for (const attr of attrs) {
            out.push(`| ${attr} | ${proficiencyBonus} |`);
          }
        }
        continue;
      }

      // "Moedas: 309 Gil" é o Gil que o parser espera no inventário.
      if (inventoryStarted && label === 'Moedas') {
        const parsed = value.match(/\d+/);
        out.push(`Gil: ${parsed ? parsed[0] : 0}`);
        continue;
      }

      // Nível e Experiência ficam no bloco de identidade, mas o parser só os
      // reconhece dentro de "Progressão".
      if (label === 'Nível' || label === 'Experiência') {
        out.push('Progressão');
        if (label === 'Experiência') {
          // "000 / 500" → dois campos separados.
          const [current, next] = value.split('/').map((v) => v.trim());
          out.push(`Experiência Atual: ${current ?? ''}`);
          if (next) out.push(`Experiência Próximo Nível: ${next}`);
        } else {
          // Fichas antigas juntam "Nível: 3" e "Experiência: ..." na mesma
          // linha; sem isolar o primeiro número o nível vira 36001500.
          const first = value.match(/-?\d+/);
          out.push(`${label}: ${first ? first[0] : value}`);
        }
        out.push(section);
        continue;
      }

      // Placeholders do modelo não são valores.
      out.push(PLACEHOLDER.test(value) ? `${label}: ` : `${label}: ${value}`);
      continue;
    }

    out.push(line);
  }

  if (backpack.length > 0) out.push(`Mochila: ${backpack.join('; ')}`);

  return {
    lines: out,
    sections: [...seen],
    skills: [...skills].map(([name, proficient]) => ({ name, proficient })),
  };
}

/**
 * Monta a lista completa de perícias já com o valor derivado: modificador
 * final do atributo mais o bônus de proficiência nas que a ficha marcou. O
 * usuário ajusta os checks no formulário depois.
 */
function buildSkills(
  data: Record<string, unknown>,
  detected: Array<{ name: string; proficient: boolean }>
) {
  const stats = data.playerStats as
    Record<string, { modifier?: number }> | undefined;
  const raw = data.stats as Record<string, number> | undefined;
  const bonus = (data.proficiencyBonus as number) ?? 0;
  const proficientNames = new Set(
    detected.filter((s) => s.proficient).map((s) => s.name)
  );

  return SKILLS.map((skill) => {
    const modifier =
      stats?.[skill.attribute]?.modifier ?? modifierOf(raw?.[skill.attribute]);
    const proficient = proficientNames.has(skill.name);

    return {
      name: skill.name,
      proficient,
      // O bônus extra fica zerado na importação: as fichas escrevem esse
      // segundo número de formas incompatíveis entre si (a do Caine usa
      // "Sobrevivência (+4)(+2)"), e errar aqui é pior do que deixar em branco
      // para o usuário preencher no campo.
      bonus: 0,
      value: skillValue(modifier, proficient, bonus, 0),
    };
  });
}

export async function importForumSheet(
  rawUrl: string
): Promise<Record<string, unknown>> {
  const url = parseTopicUrl(rawUrl);
  const html = await fetchTopicHtml(url);
  const body = extractPostBody(html);
  const { lines, sections, skills } = normalizeSheetLines(
    htmlToSheetLines(body)
  );

  // A ficha pode estar escrita num layout distante demais do modelo. Nesse caso
  // é melhor dizer isso e deixar o formulário em branco do que preencher com
  // pedaços errados que o usuário teria de caçar e corrigir.
  if (sections.length < MIN_SECTIONS) {
    throw new UnrecognizedSheetError(
      'Essa ficha não segue o modelo do fórum, então não consegui lê-la. ' +
        'Preencha o formulário do zero.'
    );
  }

  const data = parseCitizenSheetLines(lines);
  if (!data.name) {
    throw new UnrecognizedSheetError(
      'Não achei o nome do personagem nessa ficha. Preencha o formulário do zero.'
    );
  }

  return {
    ...data,
    proficiencies: {
      ...((data.proficiencies as Record<string, unknown>) ?? {}),
      skills: buildSkills(data, skills),
    },
    forumTopicUrl: url,
    importedAt: new Date(),
  };
}
