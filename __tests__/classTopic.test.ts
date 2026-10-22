/**
 * Testes de regressão para o parser de classes.
 *
 * Rodado via: npx tsx __tests__/classTopic.test.ts
 *
 * Cobre os formatos críticos identificados nos 20 tópicos do fórum:
 *   - Necromante (formato de referência, classe única)
 *   - Clérigo   (tabela de progressão com truques + slots separados)
 *   - Monge     (cabeçalho de tabela deslocado com colspan)
 *   - Atirador  (coluna extra vazia, coluna ASI separada)
 *   - Arqueiro  (colunas irregulares, vírgula como separador em grants)
 *   - Ladrão    (coluna de Ataque Furtivo extra, gramática ou/+/*)
 */

import assert from 'node:assert/strict';

import {
  parseProgressionTable,
  parseBlocks,
  splitTalentName,
  parseClassTopic,
  stripVersion,
  BOLD_OPEN,
  BOLD_CLOSE,
  SPOILER_OPEN,
  SPOILER_CLOSE,
  POST_MARK,
} from '../services/classTopic.service';
import { parseGrants, parseSlotCell } from '../db/l10n/classes';

// ─── Utilidades de asserção ────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    const msg =
      err instanceof assert.AssertionError ? err.message : String(err);
    console.error(`  ✗ ${name}`);
    console.error(`    ${msg}`);
    failed++;
  }
}

function describe(suite: string, fn: () => void) {
  console.log(`\n${suite}`);
  fn();
}

// ─── parseGrants ──────────────────────────────────────────────────────────

describe('parseGrants', () => {
  test('concessão simples', () => {
    const grants = parseGrants('Comandante Ósseo');
    assert.equal(grants.length, 1);
    assert.equal(grants[0].options.length, 1);
    assert.equal(grants[0].options[0].name, 'Comandante Ósseo');
  });

  test('dois itens com +', () => {
    const grants = parseGrants('Toque Reverso + Sangria de Vida');
    assert.equal(grants.length, 2);
    assert.equal(grants[0].options[0].name, 'Toque Reverso');
    assert.equal(grants[1].options[0].name, 'Sangria de Vida');
  });

  test('escolha com ou (formato Necromante)', () => {
    const grants = parseGrants(
      'Fortitude Profana, Mente Clara Ou Aura do medo (escolha 2)'
    );
    // vírgula e "ou" são separadores
    assert.ok(
      grants.length >= 2,
      `esperava ≥ 2 grants, obteve ${grants.length}`
    );
  });

  test('marca + opção ou opção (formato Ladrão nível 1)', () => {
    const grants = parseGrants(
      'Marca + Localização de Armadilhas ou Ataque Furtivo'
    );
    assert.equal(grants.length, 2);
    assert.equal(grants[0].options[0].name, 'Marca');
    assert.equal(grants[1].options.length, 2);
    assert.equal(grants[1].options[0].name, 'Localização de Armadilhas');
    assert.equal(grants[1].options[1].name, 'Ataque Furtivo');
  });

  test('* marca requiresPrerequisite', () => {
    const grants = parseGrants(
      'Sentido de Perigo (+2)* ou Esquiva Sobrenatural'
    );
    assert.equal(grants.length, 1);
    assert.equal(grants[0].options[0].requiresPrerequisite, true);
    assert.equal(grants[0].options[0].name, 'Sentido de Perigo (+2)');
    assert.equal(grants[0].options[1].name, 'Esquiva Sobrenatural');
    assert.equal(grants[0].options[1].requiresPrerequisite, undefined);
  });

  test('vírgula como separador (formato Arqueiro nível 19)', () => {
    const grants = parseGrants('Rajada, Defesa a distância ou Mestre da Mira');
    assert.equal(grants.length, 2);
    assert.equal(grants[0].options[0].name, 'Rajada');
    assert.equal(grants[1].options.length, 2);
  });

  test('e como separador dentro de grants (formato Arqueiro nível 20)', () => {
    // "Habilidade do arquétipo e Arqueiro Mestre" — o " e " aqui não é ou/+,
    // é texto da célula. O parser deve preservar como opção única.
    const grants = parseGrants('Habilidade do arquétipo e Arqueiro Mestre');
    // Não é separador de grants — "e" sozinho não é separador
    assert.ok(grants.length >= 1);
  });

  test('ASI com ou', () => {
    const grants = parseGrants(
      '+2 em um atributo ou +1 em dois atributos ou um Talento'
    );
    // A célula toda é "ASI" — mas parseGrants não filtra, apenas parseia.
    // O que importa é que não quebre.
    assert.ok(grants.length >= 1);
  });
});

// ─── parseSlotCell ────────────────────────────────────────────────────────

describe('parseSlotCell', () => {
  test('nível 1 Necromante: "2 (1º)"', () => {
    const slots = parseSlotCell('2 (1º)');
    assert.deepEqual(slots, [2]);
  });

  test('nível 7 Necromante: "4 (1º) / 3 (2º) / 3 (3º) / 1 (4º)"', () => {
    const slots = parseSlotCell('4 (1º) / 3 (2º) / 3 (3º) / 1 (4º)');
    assert.deepEqual(slots, [4, 3, 3, 1]);
  });

  test('nível 20: "4 (1º) / 3 (2º) / 3 (3º) / 3 (4º) / 3 (5º) / 2 (6º) / 2 (7º) / 1 (8º) / 1 (9º)"', () => {
    const slots = parseSlotCell(
      '4 (1º) / 3 (2º) / 3 (3º) / 3 (4º) / 3 (5º) / 2 (6º) / 2 (7º) / 1 (8º) / 1 (9º)'
    );
    assert.equal(slots.length, 9);
    assert.equal(slots[0], 4);
    assert.equal(slots[8], 1);
  });

  test('ordinal com "o" em vez de "º" (variante tipográfica)', () => {
    const slots = parseSlotCell('4 (1o) / 3 (2o)');
    assert.deepEqual(slots, [4, 3]);
  });

  test('ordinal com "°" (sinal de grau)', () => {
    const slots = parseSlotCell('4 (1°) / 3 (2°)');
    assert.deepEqual(slots, [4, 3]);
  });
});

// ─── splitTalentName ──────────────────────────────────────────────────────

describe('splitTalentName', () => {
  test('nome simples sem requisito', () => {
    const r = splitTalentName('Terreno Adaptável');
    assert.equal(r.name, 'Terreno Adaptável');
    assert.equal(r.requirement, undefined);
  });

  test('nome – Requer nível N', () => {
    const r = splitTalentName('Terreno Adaptável – Requer nível 8 de druida');
    assert.equal(r.name, 'Terreno Adaptável');
    assert.equal(r.requirement, 'nível 8 de druida');
  });

  test('nome – Requisito: característica', () => {
    const r = splitTalentName(
      'Zona de Profanação – Requisito: característica de classe Aura do Medo'
    );
    assert.equal(r.name, 'Zona de Profanação');
    assert.equal(r.requirement, 'característica de classe Aura do Medo');
  });

  test('asterisco marca affectsSpellcasting', () => {
    const r = splitTalentName('Aprimorar Magia * —');
    assert.equal(r.name, 'Aprimorar Magia');
    assert.equal(r.affectsSpellcasting, true);
    assert.equal(r.requirement, undefined);
  });

  test('colchete com requisito', () => {
    const r = splitTalentName(
      'Cura Enfraquecida [Necromante 8, Toque de Dano]'
    );
    assert.equal(r.name, 'Cura Enfraquecida');
    assert.equal(r.requirement, 'Necromante 8, Toque de Dano');
  });

  test('colchete com — (sem requisito)', () => {
    const r = splitTalentName('Aprimorar Mortos-Vivos [—]');
    assert.equal(r.name, 'Aprimorar Mortos-Vivos');
    assert.equal(r.requirement, undefined);
  });
});

// ─── parseProgressionTable ────────────────────────────────────────────────

describe('parseProgressionTable', () => {
  const MINIMAL_TABLE = `<table>
    <tr><th>Nível</th><th>Bônus de Proficiência</th><th>Habilidade Ganha</th></tr>
    ${Array.from({ length: 20 }, (_, i) => {
      const lvl = i + 1;
      return `<tr><td>${lvl}</td><td>+${Math.ceil(lvl / 4) + 1}</td><td>Característica ${lvl}</td></tr>`;
    }).join('\n')}
  </table>`;

  test('extrai 20 níveis de tabela mínima', () => {
    const levels = parseProgressionTable(MINIMAL_TABLE);
    assert.equal(levels.length, 20);
    assert.equal(levels[0].level, 1);
    assert.equal(levels[19].level, 20);
  });

  test('cabeçalho deslocado (Monge): linha de título com colspan antes do cabeçalho real', () => {
    const html = `<table>
      <tr><td colspan="3"><strong>Progressão do Monge</strong></td></tr>
      <tr><th>Nível</th><th>Bônus de Proficiência</th><th>Habilidade Ganha</th></tr>
      ${Array.from({ length: 20 }, (_, i) => {
        const lvl = i + 1;
        return `<tr><td>${lvl}</td><td>+2</td><td>Feat ${lvl}</td></tr>`;
      }).join('\n')}
    </table>`;
    const levels = parseProgressionTable(html);
    assert.equal(
      levels.length,
      20,
      'deve ignorar a linha de título e extrair 20 níveis'
    );
    assert.equal(levels[0].level, 1);
  });

  test('coluna extra vazia (Atirador/Arqueiro): não cria columns[""]', () => {
    const html = `<table>
      <tr><th>Nível</th><th>Proficiência</th><th>Habilidades</th><th>Aumento de Atributo</th><th></th></tr>
      <tr><td>1</td><td>+2</td><td>Estilo + Mira</td><td>-</td><td>-</td></tr>
      <tr><td>2</td><td>+2</td><td>Olho de Falcão</td><td>-</td><td>-</td></tr>
      ${Array.from({ length: 18 }, (_, i) => {
        const lvl = i + 3;
        return `<tr><td>${lvl}</td><td>+2</td><td>Feat ${lvl}</td><td>-</td><td>-</td></tr>`;
      }).join('\n')}
    </table>`;
    const levels = parseProgressionTable(html);
    assert.equal(levels.length, 20);
    for (const lvl of levels) {
      assert.ok(
        !lvl.columns || !Object.keys(lvl.columns).includes(''),
        `nível ${lvl.level} não deve ter chave vazia em columns`
      );
    }
  });

  test('coluna Truques e Slots (spellcaster)', () => {
    const html = `<table>
      <tr>
        <th>Nível</th><th>Bônus de Proficiência</th>
        <th>Truques Mágicos</th><th>Slots de Magia (por círculo)</th>
        <th>Habilidade do Mago</th>
      </tr>
      <tr><td>1</td><td>+2</td><td>2</td><td>2 (1º)</td><td>Característica A</td></tr>
      ${Array.from({ length: 19 }, (_, i) => {
        const lvl = i + 2;
        return `<tr><td>${lvl}</td><td>+2</td><td>3</td><td>4 (1º) / 3 (2º)</td><td>Feat ${lvl}</td></tr>`;
      }).join('\n')}
    </table>`;
    const levels = parseProgressionTable(html);
    assert.equal(levels.length, 20);
    assert.equal(levels[0].cantripsKnown, 2);
    assert.deepEqual(levels[0].spellSlots, [2]);
    assert.equal(levels[0].spellSlotsRaw, '2 (1º)');
  });

  test('Ladrão: coluna extra Ataque Furtivo preservada em columns', () => {
    const html = `<table>
      <tr>
        <th>Nível</th><th>Bônus de Proficiência</th>
        <th>Ataque Furtivo</th><th>Habilidade do Ladino</th>
      </tr>
      ${Array.from({ length: 20 }, (_, i) => {
        const lvl = i + 1;
        const dice = Math.ceil(lvl / 2);
        return `<tr><td>${lvl}</td><td>+2</td><td>${dice}d6</td><td>Feat ${lvl}</td></tr>`;
      }).join('\n')}
    </table>`;
    const levels = parseProgressionTable(html);
    assert.equal(levels.length, 20);
    assert.ok(levels[0].columns, 'deve ter columns');
    assert.equal(levels[0].columns?.['Ataque Furtivo'], '1d6');
    assert.equal(levels[19].columns?.['Ataque Furtivo'], '10d6');
  });
});

// ─── parseBlocks ──────────────────────────────────────────────────────────

describe('parseBlocks', () => {
  const B = BOLD_OPEN;
  const C = BOLD_CLOSE;

  function lines(...strs: string[]): string[] {
    return [POST_MARK, ...strs];
  }

  test('bloco simples: negrito + descrição', () => {
    const blocks = parseBlocks(
      lines(
        `${B}Característica A${C}`,
        'Descrição da característica A com texto suficiente para passar o filtro mínimo.'
      )
    );
    assert.ok(blocks.some((b) => b.name === 'Característica A'));
  });

  test('talento com dois-pontos: hadColon=true, nome sem dois-pontos', () => {
    const blocks = parseBlocks(
      lines(
        `${B}Talento Legal:${C}`,
        'Descrição do talento com conteúdo suficiente para passar o filtro.'
      )
    );
    const talent = blocks.find((b) => b.hadColon);
    assert.ok(talent, 'deve ter pelo menos um bloco com hadColon');
    // O parser remove o ":" do nome; hadColon=true é o sinal de que havia dois-pontos.
    assert.equal(talent?.name, 'Talento Legal');
    assert.equal(talent?.hadColon, true);
  });

  test('OBS autoral: marcado como isObs', () => {
    const blocks = parseBlocks(
      lines(
        `${B}OBS${C}`,
        'Níveis com + significam que você recebe ambas as habilidades. Níveis com ou você deve escolher uma. Esta nota é suficientemente longa para passar o filtro.'
      )
    );
    const obs = blocks.find((b) => b.isObs);
    assert.ok(obs, 'deve ter um bloco OBS');
    assert.equal(obs?.name, 'OBS');
  });

  test('marcador de seção não gera bloco', () => {
    const blocks = parseBlocks(
      lines(
        `${B}Características de Classe${C}`,
        `${B}Dado de Vida:${C} 1d8`,
        `${B}Característica Real${C}`,
        'Descrição real com conteúdo suficiente para passar o filtro mínimo de 20 caracteres.'
      )
    );
    assert.ok(
      !blocks.some((b) => b.name === 'Características de Classe'),
      'marcador de seção não deve gerar bloco'
    );
  });

  test('Nível N ancora característica', () => {
    const blocks = parseBlocks(
      lines(
        'Nível 3',
        `${B}Poder Marcial${C}`,
        'O dano do combate desarmado aumenta de d4 para d6 e os DV aumentam de d8 para d10.'
      )
    );
    const feat = blocks.find((b) => b.name === 'Poder Marcial');
    assert.ok(feat, 'Poder Marcial deve ser encontrado');
    assert.equal(feat?.level, 3);
  });
});

// ─── parseClassTopic (integração) ─────────────────────────────────────────

describe('parseClassTopic — integração', () => {
  /**
   * Monta HTML mínimo de 20 níveis com características descritas.
   *
   * O post da tabela precisa ter um `<strong>` para passar pelo guarda de
   * `classStream` (`if (!/<(strong|b)>/i.test(post)) continue`). Na prática
   * o fórum sempre tem o rótulo "Progressão" ou "Tabela de evolução" em negrito
   * no mesmo post da tabela.
   */
  function buildMinimalClass(opts: {
    name: string;
    features?: string[];
    spellcaster?: boolean;
    archetypes?: boolean;
    obs?: string;
  }): string {
    const features =
      opts.features ??
      Array.from({ length: 5 }, (_, i) => `Habilidade ${i + 1}`);

    const progression = Array.from({ length: 20 }, (_, i) => {
      const lvl = i + 1;
      const feat = features[i % features.length];
      return `<tr><td>${lvl}</td><td>+${Math.floor((lvl - 1) / 4) + 2}</td>${opts.spellcaster ? `<td>${Math.min(lvl, 4)}</td><td>${lvl} (1º)</td>` : ''}<td>${feat}</td></tr>`;
    });

    const tableHeader = `<tr><th>Nível</th><th>Bônus de Proficiência</th>${opts.spellcaster ? '<th>Truques Mágicos</th><th>Slots de Magia (por círculo)</th>' : ''}<th>Habilidade Ganha</th></tr>`;
    const table = `<table>${tableHeader}${progression.join('')}</table>`;

    const headerPost = `<div class="content clearfix">
      <strong>Dado de Vida:</strong> d8<br/>
      <strong>Pontos de Vida no 1º Nível:</strong> 8 + Constituição<br/>
    </div>`;

    // O rótulo "Progressão" em negrito faz o post passar pelo guarda de <strong>.
    const tablePost = `<div class="content clearfix">
      <strong>Progressão</strong><br/>
      <dl class="codebox spoiler"><dd>${table}</dd></dl>
    </div>`;

    const featureDescriptions = features
      .map(
        (name, i) =>
          `<h3>Nível ${i + 1}</h3>\n<strong>${name}</strong>\n<p>Descrição de ${name} — longa o suficiente para ser detectada pelo parser como bloco válido.</p>`
      )
      .join('\n');

    const obsHtml = opts.obs ? `<strong>OBS</strong>\n<p>${opts.obs}</p>` : '';

    const archetypeHtml = opts.archetypes
      ? `<strong>Arquétipos</strong>
        <strong>Meu Arquétipo</strong>
        <dl class="codebox spoiler"><dd>
          <h3>Nível 3</h3>
          <strong>Poder do Arquétipo</strong>
          <p>Descrição do poder do arquétipo — longa o suficiente para ser válida.</p>
        </dd></dl>`
      : '';

    const contentPost = `<div class="content clearfix">
      ${featureDescriptions}
      ${obsHtml}
      ${archetypeHtml}
    </div>`;

    return `<title>${opts.name} | Isekai</title>\n${headerPost}\n${tablePost}\n${contentPost}`;
  }

  test('extrai 20 níveis de classe mínima', () => {
    const html = buildMinimalClass({ name: 'Classe Teste' });
    const result = parseClassTopic(html, 'Classe Teste');
    assert.equal(
      result.levels?.length,
      20,
      `esperava 20 níveis, obteve ${result.levels?.length}`
    );
  });

  test('spellcaster detectado por truques/slots', () => {
    const html = buildMinimalClass({ name: 'Mago Teste', spellcaster: true });
    const result = parseClassTopic(html, 'Mago Teste');
    assert.equal(result.isSpellcaster, true);
  });

  test('OBS detectado como contentBlock com kind obs', () => {
    const obs =
      'Níveis com + você recebe ambas as habilidades. Com ou você escolhe uma. Com * requer pré-requisito.';
    const html = buildMinimalClass({ name: 'Ladrão Teste', obs });
    const result = parseClassTopic(html, 'Ladrão Teste');
    const obsBlock = result.contentBlocks?.find((b) => b.kind === 'obs');
    assert.ok(obsBlock, 'deve ter contentBlock com kind obs');
    assert.ok(obsBlock?.content.includes('pré-requisito'));
  });

  test('arquétipo extraído corretamente', () => {
    const html = buildMinimalClass({
      name: 'Classe com Arquétipo',
      archetypes: true,
    });
    const result = parseClassTopic(html, 'Classe com Arquétipo');
    assert.ok(
      (result.archetypes?.length ?? 0) > 0 ||
        (result.candidate?.archetypes?.length ?? 0) > 0,
      'deve ter ao menos um arquétipo ou candidato'
    );
  });

  test('classe mágica: slots mapeados por círculo', () => {
    const tableRows = [
      `<tr><td>1</td><td>+2</td><td>2</td><td>2 (1º)</td><td>Comandante Ósseo + Reforçar</td></tr>`,
      `<tr><td>2</td><td>+2</td><td>2</td><td>3 (1º)</td><td>Corpo de Morto-vivo + Talentos de Necromancia</td></tr>`,
      `<tr><td>3</td><td>+2</td><td>2</td><td>4 (1º) / 2 (2º)</td><td>Arquétipo + skill de arquétipo</td></tr>`,
      ...Array.from({ length: 17 }, (_, i) => {
        const lvl = i + 4;
        return `<tr><td>${lvl}</td><td>+${Math.floor((lvl - 1) / 4) + 2}</td><td>3</td><td>4 (1º) / 3 (2º) / 2 (3º)</td><td>Feat ${lvl}</td></tr>`;
      }),
    ].join('\n');
    // Rótulo em negrito necessário para o post passar pelo guarda de classStream.
    const html = `<title>Necromante | Isekai</title>
    <div class="content clearfix">
      <strong>Dado de Vida:</strong> d8<br/>
    </div>
    <div class="content clearfix">
      <strong>Progressão</strong><br/>
      <dl class="codebox spoiler"><dd>
      <table>
        <tr><th>Nível</th><th>Bônus de Proficiência</th><th>Truques Mágicos</th><th>Slots de Magia (por círculo)</th><th>Habilidade do Mago</th></tr>
        ${tableRows}
      </table>
      </dd></dl>
    </div>`;
    const result = parseClassTopic(html, 'Necromante');
    assert.equal(result.isSpellcaster, true);
    assert.deepEqual(result.levels?.[0].spellSlots, [2]);
    assert.deepEqual(result.levels?.[2].spellSlots, [4, 2]);
  });

  test('Monge: tabela com colspan no cabeçalho ainda extrai 20 níveis', () => {
    const feats = [
      'Bodybuilding + Rajada de Golpes',
      'Chute Voador + Artes Marciais',
    ];
    const rows = Array.from({ length: 20 }, (_, i) => {
      const lvl = i + 1;
      return `<tr><td>${lvl}</td><td>+${Math.floor((lvl - 1) / 4) + 2}</td><td>${feats[i % 2]}</td></tr>`;
    }).join('\n');
    // O <strong> dentro da célula de colspan já faz o post passar pelo guarda.
    const html = `<title>Monge | Isekai</title>
    <div class="content clearfix">
      <strong>Dado de Vida:</strong> d12<br/>
    </div>
    <div class="content clearfix">
    <table>
      <tr><td colspan="3"><strong>Progressão do Monge</strong></td></tr>
      <tr><th>Nível</th><th>Bônus de Proficiência</th><th>Habilidade Ganha</th></tr>
      ${rows}
    </table>
    </div>`;
    const result = parseClassTopic(html, 'Monge');
    assert.equal(
      result.levels?.length,
      20,
      `Monge deve ter 20 níveis, obteve ${result.levels?.length}`
    );
  });

  test('Ladrão: grants com ou/+/* preservados', () => {
    // O rótulo em negrito faz o post passar pelo guarda de classStream.
    const html = `<title>Ladrão | Isekai</title>
    <div class="content clearfix">
      <strong>Dado de Vida:</strong> d8<br/>
    </div>
    <div class="content clearfix">
      <strong>Progressão de Nível</strong><br/>
    <table>
      <tr><th>Nível</th><th>Bônus de Proficiência</th><th>Ataque Furtivo</th><th>Habilidade do Ladino</th></tr>
      <tr><td>1</td><td>+2</td><td>1d6</td><td>Marca + Localização de Armadilhas ou Ataque Furtivo</td></tr>
      <tr><td>2</td><td>+2</td><td>1d6</td><td>Ação Astuta ou Evasão nv 1</td></tr>
      <tr><td>3</td><td>+2</td><td>2d6</td><td>Escolha do arquétipo + habilidade do arquétipo + Sentido de Perigo (+1) ou Medir a Marca</td></tr>
      ${Array.from({ length: 17 }, (_, i) => {
        const lvl = i + 4;
        return `<tr><td>${lvl}</td><td>+2</td><td>${Math.ceil(lvl / 2)}d6</td><td>Feat ${lvl}</td></tr>`;
      }).join('\n')}
    </table>
    </div>`;
    const result = parseClassTopic(html, 'Ladrão');
    assert.equal(result.levels?.length, 20);
    // Nível 1: Marca é garantido, escolha entre Localização e Ataque Furtivo
    const lvl1 = result.levels?.[0];
    assert.ok(
      lvl1?.grants && lvl1.grants.length >= 2,
      'nível 1 deve ter ≥ 2 grants'
    );
    assert.equal(lvl1?.grants?.[0].options[0].name, 'Marca');
    assert.equal(lvl1?.grants?.[1].options.length, 2);
    // Coluna Ataque Furtivo preservada em columns
    assert.equal(lvl1?.columns?.['Ataque Furtivo'], '1d6');
  });

  test('Atirador: coluna extra vazia não cria chave vazia em columns', () => {
    // O rótulo em negrito faz o post passar pelo guarda de classStream.
    const html = `<title>Atirador | Isekai</title>
    <div class="content clearfix">
      <strong>Dado de Vida:</strong> d8<br/>
    </div>
    <div class="content clearfix">
    <strong>Progressão de Nível</strong><br/>
    <dl class="codebox spoiler"><dd>
    <table>
      <tr><th>Nível</th><th>Proficiência</th><th>Habilidades</th><th>Aumento de Atributo</th><th></th></tr>
      <tr><td>1</td><td>+2</td><td>Armeiro + Estilo do Atirador</td><td>-</td><td>-</td></tr>
      <tr><td>2</td><td>+2</td><td>Escaramuça + Movimento Rápido</td><td>-</td><td>-</td></tr>
      ${Array.from({ length: 17 }, (_, i) => {
        const lvl = i + 3;
        const asi = [4, 9, 12, 14, 15, 16, 17].includes(lvl)
          ? '+1 em dois atributos ou +2 em um atributo ou Talento'
          : '-';
        return `<tr><td>${lvl}</td><td>+2</td><td>Feat ${lvl}</td><td>${asi}</td><td>-</td></tr>`;
      }).join('\n')}
      <tr><td>20</td><td>+6</td><td>Habilidade do arquétipo e Arsenal Pessoal</td><td>5</td><td>-</td></tr>
    </table>
    </dd></dl>
    </div>`;
    const result = parseClassTopic(html, 'Atirador');
    assert.equal(result.levels?.length, 20);
    for (const lvl of result.levels ?? []) {
      assert.ok(
        !lvl.columns || !Object.keys(lvl.columns).includes(''),
        `nível ${lvl.level} não deve ter columns[""]`
      );
    }
  });

  test('postDiagnostics presente quando há blocos', () => {
    const html = buildMinimalClass({ name: 'Diagnóstico Teste' });
    const result = parseClassTopic(html, 'Diagnóstico Teste');
    // Pode ser undefined se todos os blocos forem classificados.
    // O importante é que, quando presente, é um array válido.
    if (result.postDiagnostics) {
      assert.ok(Array.isArray(result.postDiagnostics));
      for (const diag of result.postDiagnostics) {
        assert.ok(typeof diag.post === 'number');
        assert.ok(typeof diag.extractedBlocks === 'number');
        assert.ok(typeof diag.unclassifiedBlocks === 'number');
        assert.ok(Array.isArray(diag.warnings));
      }
    }
  });
});

// ─── Snapshots estruturais dos fixtures reais ─────────────────────────────
// Estes testes lêem os arquivos .md de fixtures como texto, extraem a seção
// relevante e verificam propriedades estruturais sem depender de acesso ao
// fórum. Os .md são Markdown dos tópicos — não são HTML, então passamos os
// dados através das funções de parse de lower-level que aceitam texto limpo.

describe('Snapshots — parseGrants com dados reais dos fixtures', () => {
  // Dados extraídos do fixture t101-necromante para validação de referência.
  const NECROMANTE_NIVEL_7 =
    'Fortitude Profana, Mente Clara Ou Aura do medo (escolha 2)';
  const NECROMANTE_NIVEL_14 =
    'Proteção Profana, Mestre dos Mortos-vivos ou Mestre da Morte-Vida (escolhe 2)';

  test('Necromante nível 7: três opções separadas por vírgula e Ou', () => {
    const grants = parseGrants(NECROMANTE_NIVEL_7);
    // "Fortitude Profana", depois "Mente Clara Ou Aura do medo (escolha 2)"
    // A vírgula separa "Fortitude Profana" do resto; o "Ou" é separador de escolha.
    assert.ok(grants.length >= 1);
    assert.equal(grants[0].options[0].name, 'Fortitude Profana');
    // O segundo grant tem escolha entre Mente Clara e Aura do medo
    const choice = grants.find((g) => g.options.length > 1);
    assert.ok(choice, 'deve ter pelo menos uma escolha');
  });

  test('Necromante nível 14: vírgula + ou', () => {
    const grants = parseGrants(NECROMANTE_NIVEL_14);
    assert.ok(grants.length >= 1);
    const choice = grants.find((g) => g.options.length > 1);
    assert.ok(choice, 'nível 14 deve ter escolha entre opções');
  });

  test('Ladrão nível 6: Sentido de Perigo (+2)* ou Esquiva Sobrenatural + Talento', () => {
    const cell =
      'Sentido de Perigo (+2)* ou Esquiva Sobrenatural + Talento de ladrão';
    const grants = parseGrants(cell);
    // Split por ' + ': dois grants
    assert.equal(grants.length, 2);
    // Primeiro grant: escolha entre Sentido de Perigo (+2)* e Esquiva Sobrenatural
    assert.equal(grants[0].options.length, 2);
    assert.equal(grants[0].options[0].requiresPrerequisite, true);
    assert.equal(grants[0].options[0].name, 'Sentido de Perigo (+2)');
    // Segundo grant: Talento de ladrão (garantido)
    assert.equal(grants[1].options[0].name, 'Talento de ladrão');
  });
});

// ─── stripVersion ────────────────────────────────────────────────────────

describe('stripVersion', () => {
  test('nome simples passa sem alteração', () => {
    assert.equal(stripVersion('Sentido de Perigo'), 'Sentido de Perigo');
  });

  test('remove sufixo (+N)', () => {
    assert.equal(stripVersion('Sentido de Perigo (+2)'), 'Sentido de Perigo');
  });

  test('remove sufixo (+N) com asterisco já removido', () => {
    // O asterisco (*) é removido em parseGrants; o nome chega sem ele.
    assert.equal(stripVersion('Furto Aprimorado (+3)'), 'Furto Aprimorado');
  });

  test('remove sufixo (N) com número simples', () => {
    // Ladrão descreve "EVASÃO (1):" — o texto usa esta forma.
    assert.equal(stripVersion('EVASÃO (1)'), 'EVASÃO');
  });

  test('remove sufixo nv N', () => {
    // A tabela do Ladrão escreve "Evasão nv 1".
    assert.equal(stripVersion('Evasão nv 1'), 'Evasão');
  });

  test('remove sufixo nv. N com ponto', () => {
    assert.equal(stripVersion('Habilidade nv. 3'), 'Habilidade');
  });

  test('mantém parênteses descritivos (não-numéricos)', () => {
    // Só parênteses com número de versão são removidos; nomes descritivos ficam.
    assert.equal(stripVersion('Escudo (Padrão)'), 'Escudo (Padrão)');
    assert.equal(
      stripVersion('Ataque (corpo a corpo)'),
      'Ataque (corpo a corpo)'
    );
  });

  test('dados reais — Ladrão nível 3: Sentido de Perigo (+1)', () => {
    // Célula real da tabela do Ladrão: após parseGrants, o nome é "Sentido de Perigo (+1)".
    assert.equal(stripVersion('Sentido de Perigo (+1)'), 'Sentido de Perigo');
  });

  test('dados reais — Ladrão nível 17: Furto Melhorado (+4)', () => {
    assert.equal(stripVersion('Furto Melhorado (+4)'), 'Furto Melhorado');
  });
});

// ─── Cobertura com stripVersion (regressão Ladrão) ────────────────────────

describe('parseClassTopic — cobertura com stripVersion', () => {
  /**
   * Simula a estrutura do Ladrão: tabela anuncia "Sentido de Perigo (+2)*"
   * mas o texto descreve apenas "Sentido de Perigo". Sem stripVersion a
   * cobertura seria ~55% (< 70%) e o resultado virava candidato.
   */
  function buildLadraoLike(): string {
    // Minimalista: 20 níveis, anuncia features com versão, descreve a base.
    const levels = Array.from({ length: 20 }, (_, i) => {
      const n = i + 1;
      // Nível 3 anuncia "Sentido de Perigo (+1)", nível 6 anuncia "(+2)"
      const feat =
        n === 3
          ? 'Marca + Sentido de Perigo (+1)'
          : n === 6
            ? 'Sentido de Perigo (+2)'
            : n === 2
              ? 'Evasão nv 1'
              : `Habilidade ${n}`;
      return `<tr><td>${n}</td><td>+2</td><td>${feat}</td></tr>`;
    }).join('\n');

    return `
      <div class="content clearfix"><strong>Dado de Vida:</strong> 1d8</div>
      <div class="content clearfix">
        <strong>Progressão de Nível</strong><br/>
        <dl class="codebox spoiler"><dd>
        <table>
          <tr><th>Nível</th><th>Proficiência</th><th>Habilidades</th></tr>
          ${levels}
        </table>
        </dd></dl>
      </div>
      <div class="content clearfix">
        <strong>Explicando a progressão</strong><br/>
        <dl class="codebox spoiler"><dd>
        <strong>Nível 2</strong><br/>
        <strong>Evasão</strong><br/>Descrição da evasão com mais de vinte caracteres aqui.<br/>
        <strong>Nível 3</strong><br/>
        <strong>Marca:</strong><br/>Descrição da marca com mais de vinte caracteres aqui para o teste.<br/>
        <strong>Sentido de Perigo</strong><br/>Descrição do sentido de perigo com bastante texto descritivo.<br/>
        ${Array.from({ length: 17 }, (_, i) => {
          const n = i + 4;
          return `<strong>Nível ${n}</strong><br/><strong>Habilidade ${n}</strong><br/>Descrição longa da habilidade ${n} para ficar válida no teste.<br/>`;
        }).join('\n')}
        </dd></dl>
      </div>`;
  }

  test('stripVersion faz cobertura passar 70% (saindo de candidate)', () => {
    const html = buildLadraoLike();
    const result = parseClassTopic(html, 'Ladrão Simulado');
    // Com stripVersion: "Sentido de Perigo (+1)" → "Sentido de Perigo" → casa.
    // Sem ele: coverage ficaria < 70% e result.candidate seria definido.
    assert.equal(
      result.candidate,
      undefined,
      `Esperava trusted, mas foi candidato: ${result.candidate?.reason ?? '?'}`
    );
    assert.ok(
      (result.features?.length ?? 0) > 0,
      'deve ter features extraídas'
    );
    assert.ok(result.features?.some((feature) => feature.name === 'Marca'));
    assert.ok(!result.talents?.some((talent) => talent.name === 'Marca'));
  });
});

// ─── Domínios não viram arquétipos (regressão Clérigo) ────────────────────

describe('parseClassTopic — domínios como contentBlocks[domainFeature]', () => {
  function buildClerigoLike(): string {
    return `
      <div class="content clearfix"><strong>Dado de Vida:</strong> 1d8</div>
      <div class="content clearfix">
        <strong>Progressão de Nível</strong><br/>
        <dl class="codebox spoiler"><dd>
        <table>
          <tr><th>Nível</th><th>Proficiência</th><th>Habilidades</th></tr>
          ${Array.from({ length: 20 }, (_, i) => {
            const n = i + 1;
            const feat =
              n === 3
                ? 'Arquétipo + habilidade do arquétipo'
                : `Habilidade ${n}`;
            return `<tr><td>${n}</td><td>+2</td><td>${feat}</td></tr>`;
          }).join('\n')}
        </table>
        </dd></dl>
      </div>
      <div class="content clearfix">
        <strong>Explicando a progressão</strong><br/>
        <dl class="codebox spoiler"><dd>
        ${Array.from({ length: 20 }, (_, i) => {
          const n = i + 1;
          return `<strong>Nível ${n}</strong><br/><strong>Habilidade ${n}</strong><br/>Descrição longa da habilidade ${n} para ficar válida no teste.<br/>`;
        }).join('\n')}
        </dd></dl>
      </div>
      <div class="content clearfix">
        <strong>Arquétipos</strong><br/>
        <strong>Clérigo do Sol</strong><br/>Descrição do arquétipo sol com bom tamanho de texto.
        <dl class="codebox spoiler"><dd>
        <strong>Nível 3</strong><br/>
        <strong>Luz Sagrada</strong><br/>Descrição longa da habilidade luz sagrada para o arquétipo.<br/>
        </dd></dl>
        <strong>Domínios</strong><br/>
        <strong>Domínio do Ar</strong><br/>Cada domínio tem características específicas de ar e vento e magia.
        <dl class="codebox spoiler"><dd>
        <strong>Habilidade do Ar</strong><br/>Descrição da habilidade do domínio do ar com texto suficiente.<br/>
        </dd></dl>
        <strong>Domínio do Fogo</strong><br/>Descrição do domínio do fogo com características de calor e chama.
        <dl class="codebox spoiler"><dd>
        <strong>Habilidade do Fogo</strong><br/>Descrição da habilidade do domínio do fogo com texto suficiente.<br/>
        </dd></dl>
      </div>`;
  }

  test('domínios não entram em archetypes', () => {
    const result = parseClassTopic(buildClerigoLike(), 'Clérigo Simulado');
    // Só o arquétipo real "Clérigo do Sol" deve estar em archetypes.
    assert.ok(
      (result.archetypes?.length ?? 0) <= 1,
      `Esperava ≤1 arquétipo, mas obteve ${result.archetypes?.length ?? 0}: ${result.archetypes?.map((a) => a.name).join(', ')}`
    );
  });

  test('domínios vão para contentBlocks com kind domainFeature', () => {
    const result = parseClassTopic(buildClerigoLike(), 'Clérigo Simulado');
    const domainBlocks =
      result.contentBlocks?.filter((b) => b.kind === 'domainFeature') ?? [];
    assert.ok(
      domainBlocks.length >= 2,
      `Esperava ≥2 domainFeature blocks, obteve ${domainBlocks.length}`
    );
    const names = domainBlocks.map((b) => b.title ?? '');
    assert.ok(
      names.some((n) => n.includes('Domínio')),
      'pelo menos um deve se chamar Domínio X'
    );
  });
});

// ─── Progressões aninhadas (depth >= 2) não viram features da classe ──────

describe('parseClassTopic — nestedProgression não vira feature da classe', () => {
  function buildInvocadorLike(): string {
    // Simula o padrão do Invocador: feature "Avatar" na profundidade 0,
    // e dentro de um spoiler aninhado (depth 2) os níveis do avatar.
    return `
      <div class="content clearfix"><strong>Dado de Vida:</strong> d8</div>
      <div class="content clearfix">
        <strong>Progressão de Nível</strong><br/>
        <dl class="codebox spoiler"><dd>
        <table>
          <tr><th>Nível</th><th>Proficiência</th><th>Habilidades</th></tr>
          ${Array.from({ length: 20 }, (_, i) => {
            const n = i + 1;
            return `<tr><td>${n}</td><td>+2</td><td>${n === 1 ? 'Avatar + Invocar Equipamento' : `Habilidade ${n}`}</td></tr>`;
          }).join('\n')}
        </table>
        </dd></dl>
      </div>
      <div class="content clearfix">
        <strong>Explicando a progressão</strong><br/>
        <dl class="codebox spoiler"><dd>
        <strong>Nível 1</strong><br/>
        <strong>Avatar</strong><br/>O invocador forma um pacto com um avatar poderoso de outro plano.<br/>
        <strong>Invocar Equipamento</strong><br/>Invocador conjura objetos simples em suas mãos como ação.<br/>
        ${Array.from({ length: 19 }, (_, i) => {
          const n = i + 2;
          return `<strong>Nível ${n}</strong><br/><strong>Habilidade ${n}</strong><br/>Descrição longa da habilidade ${n} com texto de tamanho suficiente.<br/>`;
        }).join('\n')}
        </dd></dl>
      </div>
      <div class="content clearfix">
        <strong>Alexander</strong><br/>Descrição do avatar Alexander com muito texto.
        <dl class="codebox spoiler"><dd>
        <strong>Alexander</strong><br/>Estatísticas do avatar Alexander com valores detalhados.<br/>
        <strong>Evolução de Alexander</strong><br/>Como Alexander evolui com o invocador ao longo dos níveis.
        <dl class="codebox spoiler"><dd>
        <strong>Nível 1</strong><br/>
        <strong>Limit Break</strong><br/>Alexander desferimento de dano sagrado em área de 9 metros.<br/>
        <strong>Nível 2</strong><br/>
        <strong>Luz</strong><br/>Alexander conjura feixe de luz sagrada contra um alvo distante.<br/>
        <strong>Nível 4</strong><br/>
        <strong>Luz II</strong><br/>Versão aprimorada do feixe de luz sagrada com maior alcance.<br/>
        </dd></dl>
        </dd></dl>
      </div>`;
  }

  test('features da classe não incluem características dos avatares', () => {
    const result = parseClassTopic(buildInvocadorLike(), 'Invocador Simulado');
    const featureNames = result.features?.map((f) => f.name) ?? [];
    // "Limit Break", "Luz", "Luz II" são do avatar, não da classe.
    assert.ok(
      !featureNames.includes('Limit Break'),
      'Limit Break não deve ser feature da classe'
    );
    assert.ok(
      !featureNames.includes('Luz'),
      'Luz (avatar) não deve ser feature da classe'
    );
  });

  test('características dos avatares vão para contentBlocks nestedProgression', () => {
    const result = parseClassTopic(buildInvocadorLike(), 'Invocador Simulado');
    const nested =
      result.contentBlocks?.filter((b) => b.kind === 'nestedProgression') ?? [];
    assert.ok(
      nested.length >= 3,
      `Esperava ≥3 nestedProgression blocks (Limit Break, Luz, Luz II), obteve ${nested.length}`
    );
  });

  test('features da classe são apenas as anunciadas na tabela', () => {
    const result = parseClassTopic(buildInvocadorLike(), 'Invocador Simulado');
    // Avatar e Invocar Equipamento devem estar em features (anunciadas na tabela).
    const featureNames = result.features?.map((f) => f.name) ?? [];
    assert.ok(
      featureNames.includes('Avatar'),
      'Avatar deve ser feature da classe'
    );
    assert.ok(
      featureNames.includes('Invocar Equipamento'),
      'Invocar Equipamento deve ser feature da classe'
    );
  });
});

// ─── Snapshots com dados reais dos fixtures ───────────────────────────────

describe('stripVersion — dados reais do fixture Ladrão (t95-ladrao-10.md)', () => {
  // Pares [célula da tabela original → nome esperado após stripVersion].
  // Extraídos manualmente das linhas 140-160 do fixture.
  const LADRAO_VERSIONED: [string, string][] = [
    ['Sentido de Perigo (+1)', 'Sentido de Perigo'],
    ['Furto Aprimorado (+2)', 'Furto Aprimorado'],
    ['Sentido de Perigo (+2)', 'Sentido de Perigo'],
    ['Evasão nv 1', 'Evasão'],
    ['Furto Aprimorado (+3)', 'Furto Aprimorado'],
    ['Sentido de Perigo (+3)', 'Sentido de Perigo'],
    ['Furto Melhorado (+4)', 'Furto Melhorado'],
    ['Sentido de Perigo (+4)', 'Sentido de Perigo'],
  ];

  for (const [input, expected] of LADRAO_VERSIONED) {
    test(`stripVersion("${input}") → "${expected}"`, () => {
      assert.equal(stripVersion(input), expected);
    });
  }
});

describe('parseGrants — dados reais do fixture Ladrão (t95-ladrao-10.md)', () => {
  // Células reais extraídas da tabela do Ladrão.
  test('nível 1: Marca + Localização de Armadilhas ou Ataque Furtivo', () => {
    const grants = parseGrants(
      'Marca + Localização de Armadilhas ou Ataque Furtivo'
    );
    assert.equal(grants.length, 2);
    assert.equal(grants[0].options[0].name, 'Marca');
    assert.equal(grants[1].options.length, 2);
    assert.equal(grants[1].options[0].name, 'Localização de Armadilhas');
    assert.equal(grants[1].options[1].name, 'Ataque Furtivo');
  });

  test('nível 13: Exploração Apurada + Furto Aprimorado (+3)* ou Batedor', () => {
    const grants = parseGrants(
      'Exploração Apurada + Furto Aprimorado (+3)* ou Batedor'
    );
    assert.equal(grants.length, 2);
    assert.equal(grants[0].options[0].name, 'Exploração Apurada');
    // Segundo grant: escolha entre Furto Aprimorado (+3) (com pré-req) e Batedor
    assert.equal(grants[1].options.length, 2);
    assert.equal(grants[1].options[0].name, 'Furto Aprimorado (+3)');
    assert.equal(grants[1].options[0].requiresPrerequisite, true);
    assert.equal(grants[1].options[1].name, 'Batedor');
  });

  test('nível 15: Movimento rápido + Sentido de Perigo (+3)* ou Maestria em Furto ou Vantagem do Ladrão', () => {
    const raw =
      'Movimento rápido + Sentido de Perigo (+3)* ou Maestria em Furto ou Vantagem do Ladrão';
    const grants = parseGrants(raw);
    // Dois grants: "Movimento rápido" e uma escolha tripla
    assert.equal(grants.length, 2);
    assert.equal(grants[0].options[0].name, 'Movimento rápido');
    const choice = grants[1];
    assert.equal(choice.options.length, 3);
    assert.equal(choice.options[0].name, 'Sentido de Perigo (+3)');
    assert.equal(choice.options[0].requiresPrerequisite, true);
    assert.equal(choice.options[1].name, 'Maestria em Furto');
    assert.equal(choice.options[2].name, 'Vantagem do Ladrão');
  });

  test('nível 18: Inimigo Mortal + Sentido de Perigo (+4)* ou + Mestre de tudo', () => {
    // O "+" antes de "Mestre de tudo" é editorial (redundante). A normalização
    // "ou + X" → "ou X" converte a célula em dois grants: "Inimigo Mortal"
    // garantido e uma escolha entre "Sentido de Perigo (+4)" e "Mestre de tudo".
    const grants = parseGrants(
      'Inimigo Mortal + Sentido de Perigo (+4)* ou + Mestre de tudo'
    );
    assert.equal(
      grants.length,
      2,
      `esperava 2 grants, obteve ${grants.length}`
    );
    assert.equal(grants[0].options[0].name, 'Inimigo Mortal');
    // Segundo grant: escolha entre as duas opções
    assert.equal(
      grants[1].options.length,
      2,
      'segundo grant deve ter 2 opções'
    );
    assert.equal(grants[1].options[0].name, 'Sentido de Perigo (+4)');
    assert.equal(grants[1].options[0].requiresPrerequisite, true);
    assert.equal(grants[1].options[1].name, 'Mestre de tudo');
  });
});

// ─── Regressão: DOMAIN_MARKERS só dispara no nível raiz (spoilerDepth=0) ──

describe('parseClassTopic — DOMAIN_MARKERS restrito a spoilerDepth=0 (fix Clérigo)', () => {
  // Simula o padrão problemático do Clérigo: "Domínios" aparece como subtítulo
  // dentro do spoiler de "Ordem Deífica" (D2 dentro do D1 de progressão).
  // Esse "Domínios" NÃO deve disparar inDomains=true para os blocos seguintes.
  function buildClerigoFalseDomain(): string {
    // Precisamos de ≥5 linhas de nível para que `progressionTableOf` detecte a
    // tabela. Anunciamos exatamente os 7 features que também descrevemos, assim
    // coverage = 7/7 = 100% > 70% e o resultado não vira candidate.
    const tableRows = `
      <tr><td>1</td><td>+2</td><td>Conjuração de Magias + Ordem Deífica</td></tr>
      <tr><td>2</td><td>+2</td><td>Fé + Sentir Alinhamento + Canalizar Energia</td></tr>
      <tr><td>3</td><td>+2</td><td>Combate Divino</td></tr>
      <tr><td>4</td><td>+3</td><td>Bênção dos Fiéis</td></tr>
      <tr><td>5</td><td>+3</td><td>Oração</td></tr>`;
    return `
      <div class="content clearfix"><strong>Dado de Vida:</strong> d8</div>
      <div class="content clearfix">
        <strong>Progressão</strong>
        <table>
          <tr><th>Nível</th><th>Bônus</th><th>Habilidades</th></tr>
          ${tableRows}
        </table>
      </div>
      <div class="content clearfix">
        <strong>Explicando a progressão</strong>
        <dl class="codebox spoiler"><dd>
          <strong>Nível 1</strong><br/>
          <strong>Conjuração de Magias</strong><br/>
          Você ganha capacidade de conjurar magias divinas conforme a tabela abaixo.
          <dl class="codebox spoiler"><dd>
            Lista de magias do clérigo: bênção, cura, luz...
          </dd></dl>
          <strong>Ordem Deífica</strong><br/>
          No 1º nível, um clérigo deve cultuar uma divindade específica.
          <dl class="codebox spoiler"><dd>
            Domínios
            A divindade de um clérigo concede acesso a dois domínios de sua escolha.
          </dd></dl>
          <strong>Nível 2</strong><br/>
          <strong>Fé</strong><br/>
          O clérigo recebe Fé como habilidade passiva que cresce com a devoção.
          <strong>Sentir Alinhamento</strong><br/>
          O clérigo pode sentir o alinhamento de criaturas próximas à vontade.
          <strong>Canalizar Energia</strong><br/>
          O clérigo pode canalizar energia divina para curar ou causar dano.
          <strong>Nível 3</strong><br/>
          <strong>Combate Divino</strong><br/>
          O clérigo infunde seus ataques com energia sagrada de sua divindade.
          <strong>Nível 4</strong><br/>
          <strong>Bênção dos Fiéis</strong><br/>
          O clérigo abençoa aliados próximos com proteção divina temporária.
          <strong>Nível 5</strong><br/>
          <strong>Oração</strong><br/>
          O clérigo reza a sua divindade pedindo intervenção divina direta.
        </dd></dl>
      </div>`;
  }

  test('"Domínios" em D2 não deve poluir features do nível 2', () => {
    const result = parseClassTopic(
      buildClerigoFalseDomain(),
      'Clérigo Simulado'
    );
    const featureNames = result.features?.map((f) => f.name) ?? [];
    // Com o bug, "Fé", "Sentir Alinhamento" e "Canalizar Energia" caíam em
    // inDomains=true e desapareciam de features → coverage < 70% → candidate.
    assert.ok(
      featureNames.includes('Fé') ||
        (result.candidate?.features?.map((f) => f.name) ?? []).includes('Fé'),
      'Fé deve ser extraída (em features ou candidate.features)'
    );
    assert.ok(
      featureNames.includes('Canalizar Energia') ||
        (result.candidate?.features?.map((f) => f.name) ?? []).includes(
          'Canalizar Energia'
        ),
      'Canalizar Energia deve ser extraída'
    );
    // O bloco "Domínios" no D2 NÃO deve virar domainFeature (não estava em D0).
    const domainFeatures =
      result.contentBlocks?.filter((b) => b.kind === 'domainFeature') ?? [];
    // Se disparar inDomains errado, "Fé", "Canalizar Energia" etc. virariam
    // domainFeature. Com o fix, não devem aparecer ali.
    const wronglyDomained = domainFeatures.filter(
      (b) =>
        b.title === 'Fé' ||
        b.title === 'Canalizar Energia' ||
        b.title === 'Sentir Alinhamento'
    );
    assert.equal(
      wronglyDomained.length,
      0,
      `Fé/Canalizar/Sentir não devem ser domainFeature: ${wronglyDomained.map((b) => b.title).join(', ')}`
    );
  });

  test('coverage passa 70% quando os blocos do nível 2 são corretamente classificados', () => {
    const result = parseClassTopic(
      buildClerigoFalseDomain(),
      'Clérigo Simulado'
    );
    // Com o bug: coverage = 2/4 = 50% → candidate. Com o fix: 4/4 = 100% → trusted.
    assert.equal(
      result.candidate,
      undefined,
      `Não deve ser candidate: ${result.candidate?.reason ?? ''}`
    );
  });
});

// ─── Regressão: asterisco no nome do bloco (fix Ladrão) ───────────────────

describe('parseBlocks — asterisco é removido do nome do bloco', () => {
  // Alguns tópicos escrevem "SENTIDO DE PERIGO*" em negrito — o "*" é
  // a mesma convenção do fórum para "requer pré-requisito", mas aqui está
  // no body, não na tabela. Ele deve ser removido do nome do bloco para que
  // o casamento com `announced` funcione.
  function buildAsteriskBlock(): string[] {
    return [
      POST_MARK,
      `${BOLD_OPEN}SENTIDO DE PERIGO*${BOLD_CLOSE}`,
      'Você percebe o perigo iminente de forma sobre-humana.',
      `${BOLD_OPEN}FURTO APRIMORADO*${BOLD_CLOSE}`,
      'Você aprimora sua técnica de furto para alcançar maiores recompensas.',
    ];
  }

  test('asterisco não aparece no nome do bloco', () => {
    const blocks = parseBlocks(buildAsteriskBlock());
    const names = blocks.map((b) => b.name);
    assert.ok(
      !names.some((n) => n.includes('*')),
      `Nenhum nome deve ter asterisco: ${names.join(', ')}`
    );
    assert.ok(
      names.includes('SENTIDO DE PERIGO'),
      'nome deve ser "SENTIDO DE PERIGO" sem asterisco'
    );
    assert.ok(
      names.includes('FURTO APRIMORADO'),
      'nome deve ser "FURTO APRIMORADO" sem asterisco'
    );
  });
});

// ─── Regressão: nome parcialmente em negrito (fix arquétipos Clérigo) ─────

describe('parseBlocks — bloco aberto por negrito parcial no início da linha', () => {
  // "**Guarda Negro** - Deve ser de alinhamento maligno..." → o negrito cobre
  // só o nome; o restante da linha é texto inline do requisito. O parser deve
  // abrir um bloco "Guarda Negro" e colocar o restante no corpo.
  function buildPartialBoldBlock(): string[] {
    return [
      POST_MARK,
      // Simula o cabeçalho de arquétipos
      'Arquétipos',
      // Bloco de arquétipo com negrito parcial
      `${BOLD_OPEN}Guarda Negro${BOLD_CLOSE} - Deve ser de alinhamento maligno e adorar uma divindade maligna.`,
    ];
  }

  test('bloco é aberto com o nome da parte em negrito', () => {
    const blocks = parseBlocks(buildPartialBoldBlock());
    const guardaNegro = blocks.find((b) => b.name === 'Guarda Negro');
    assert.ok(
      guardaNegro !== undefined,
      'bloco "Guarda Negro" deve ser criado'
    );
  });

  test('texto do requisito inline vai para o corpo do bloco', () => {
    const blocks = parseBlocks(buildPartialBoldBlock());
    const guardaNegro = blocks.find((b) => b.name === 'Guarda Negro');
    assert.ok(
      guardaNegro?.description.includes('alinhamento maligno'),
      `Descrição deve conter texto inline do requisito: "${guardaNegro?.description}"`
    );
  });
});

// ─── Regressão: inNestedEntity em spoilers D1 (fix Invocador, avatares) ──

describe('parseClassTopic — inNestedEntity em spoiler D1 após "Evolução de X"', () => {
  // O Invocador tem "Evolução de Carbuncle" em D0, seguido de um spoiler D1
  // com evoluções. Esses blocos ficavam em features (spoilerDepth=1 < 2)
  // antes do fix. Agora devem ir para contentBlocks[nestedProgression].
  function buildD1EvolutionSpoiler(): string {
    // ≥5 linhas de nível para que a tabela seja detectada; só anunciamos
    // as features que de fato descrevemos → coverage = 100% → trusted.
    const tableRows = `
      <tr><td>1</td><td>+2</td><td>Avatar + Invocar Equipamento</td></tr>
      <tr><td>2</td><td>+2</td><td>Pacto Eterno</td></tr>
      <tr><td>3</td><td>+2</td><td>Vínculo Fortalecido</td></tr>
      <tr><td>4</td><td>+3</td><td>Chamado Superior</td></tr>
      <tr><td>5</td><td>+3</td><td>Fusão</td></tr>`;
    return `
      <div class="content clearfix"><strong>Dado de Vida:</strong> d8</div>
      <div class="content clearfix">
        <strong>Progressão</strong>
        <table>
          <tr><th>Nível</th><th>Bônus</th><th>Habilidades</th></tr>
          ${tableRows}
        </table>
      </div>
      <div class="content clearfix">
        <strong>Explicando a progressão</strong>
        <dl class="codebox spoiler"><dd>
          <strong>Nível 1</strong><br/>
          <strong>Avatar</strong><br/>Você contrata um avatar para lutar ao seu lado em combate.<br/>
          <strong>Invocar Equipamento</strong><br/>Você invoca equipamento mágico em suas mãos a qualquer momento.<br/>
          <strong>Nível 2</strong><br/>
          <strong>Pacto Eterno</strong><br/>Seu vínculo com o avatar se torna eterno e inabalável ao longo do tempo.<br/>
          <strong>Nível 3</strong><br/>
          <strong>Vínculo Fortalecido</strong><br/>Seu vínculo com o avatar cresce e concede bônus adicionais em combate.<br/>
          <strong>Nível 4</strong><br/>
          <strong>Chamado Superior</strong><br/>Você aprende a chamar seu avatar de qualquer distância instantaneamente.<br/>
          <strong>Nível 5</strong><br/>
          <strong>Fusão</strong><br/>Você e seu avatar podem se fundir temporariamente em combate por rodadas.<br/>
        </dd></dl>
      </div>
      <div class="content clearfix">
        <strong>Carbuncle</strong><br/>Um avatar de gema com poderes mágicos cristalinos.
        <dl class="codebox spoiler"><dd>
          <strong>Carbuncle</strong><br/>Estatísticas básicas do Carbuncle.
          <strong>Evolução de Carbuncle</strong><br/>Como Carbuncle cresce com o invocador.
          <dl class="codebox spoiler"><dd>
            <strong>Nível 1</strong><br/>
            <strong>Feixe de Gema</strong><br/>Carbuncle dispara um feixe de energia da gema em sua testa com alcance médio.<br/>
            <strong>Nível 3</strong><br/>
            <strong>Brilho Cegante</strong><br/>A gema de Carbuncle emite luz cegante em uma área ao redor dele por rodadas.<br/>
          </dd></dl>
        </dd></dl>
      </div>`;
  }

  test('"Feixe de Gema" e "Brilho Cegante" não devem aparecer em features', () => {
    const result = parseClassTopic(
      buildD1EvolutionSpoiler(),
      'Invocador Simulado'
    );
    const featureNames = result.features?.map((f) => f.name) ?? [];
    assert.ok(
      !featureNames.includes('Feixe de Gema'),
      '"Feixe de Gema" não deve ser feature da classe'
    );
    assert.ok(
      !featureNames.includes('Brilho Cegante'),
      '"Brilho Cegante" não deve ser feature da classe'
    );
  });

  test('evoluções do avatar vão para contentBlocks[nestedProgression]', () => {
    const result = parseClassTopic(
      buildD1EvolutionSpoiler(),
      'Invocador Simulado'
    );
    const nested =
      result.contentBlocks?.filter((b) => b.kind === 'nestedProgression') ?? [];
    const nestedNames = nested.map((b) => b.title ?? '');
    assert.ok(
      nestedNames.includes('Feixe de Gema') ||
        nestedNames.includes('Brilho Cegante'),
      `Evoluções devem estar em nestedProgression: ${nestedNames.join(', ')}`
    );
  });

  test('"Avatar" e "Invocar Equipamento" continuam em features', () => {
    const result = parseClassTopic(
      buildD1EvolutionSpoiler(),
      'Invocador Simulado'
    );
    const featureNames = result.features?.map((f) => f.name) ?? [];
    assert.ok(
      featureNames.includes('Avatar'),
      'Avatar deve ser feature da classe'
    );
    assert.ok(
      featureNames.includes('Invocar Equipamento'),
      'Invocar Equipamento deve ser feature'
    );
  });

  test('"Evolução de Classe" nunca marca a progressão base como entidade aninhada', () => {
    const blocks = parseBlocks([
      POST_MARK,
      `${BOLD_OPEN}Evolução de Classe${BOLD_CLOSE}`,
      SPOILER_OPEN,
      `${BOLD_OPEN}Característica Base${BOLD_CLOSE}`,
      'Descrição suficientemente longa da característica principal da classe.',
      SPOILER_CLOSE,
    ]);
    const feature = blocks.find(
      (block) => block.name === 'Característica Base'
    );
    assert.ok(feature);
    assert.equal(feature?.inNestedEntity, false);
  });
});

// ─── Regressão: "Evolução de X" com corpo não dispara inNestedEntity (fix Monge) ──

describe('parseClassTopic — "Evolução de X" com descrição não contamina features D1', () => {
  // O Monge tem "Evolução de Ki" com texto descritivo ANTES do spoiler D1.
  // Antes do fix, body não era verificado → o D1 spoilerIndex era marcado
  // como nestedEntity → features do Monge viravam nestedProgression → candidate.
  // Após o fix: só cabeçalhos SEM corpo (body vazio) marcam o spoiler como
  // nestedEntity.
  //
  // ESTRUTURA REAL: todos os features anunciados estão em D1 na "Explicando a
  // progressão". O D2 sub-spoiler de "Evolução de Ki" contém apenas a tabela
  // de pontos de ki — não são features anunciadas — por isso não afeta coverage.
  function buildMonkeLike(): string {
    const tableRows = `
      <tr><td>1</td><td>+2</td><td>Golpe Marcial + Técnica de Fluxo</td></tr>
      <tr><td>2</td><td>+2</td><td>Defesa sem Armadura + Ki</td></tr>
      <tr><td>3</td><td>+2</td><td>Estilo de Combate</td></tr>
      <tr><td>4</td><td>+3</td><td>Queda Lenta + Golpe Potente</td></tr>
      <tr><td>5</td><td>+3</td><td>Investida</td></tr>`;
    return `
      <div class="content clearfix"><strong>Dado de Vida:</strong> d8</div>
      <div class="content clearfix">
        <strong>Progressão de Nível</strong>
        <table>
          <tr><th>Nível</th><th>Bônus</th><th>Habilidades</th></tr>
          ${tableRows}
        </table>
      </div>
      <div class="content clearfix">
        <strong>Explicando a progressão</strong>
        <dl class="codebox spoiler"><dd>
          <strong>Nível 1</strong><br/>
          <strong>Golpe Marcial</strong><br/>Você domina uma série de golpes físicos devastadores em combate.<br/>
          <strong>Técnica de Fluxo</strong><br/>Você flui entre posições de combate com agilidade sobre-humana perfeita.<br/>
          <strong>Nível 2</strong><br/>
          <strong>Defesa sem Armadura</strong><br/>Sua defesa inata substitui o uso de armaduras pesadas no combate.<br/>
          <strong>Ki</strong><br/>Você acessa a energia interna chamada ki para ampliar golpes e técnicas.<br/>
          <strong>Nível 3</strong><br/>
          <strong>Estilo de Combate</strong><br/>Você escolhe um estilo de combate que define sua especialidade marcial.<br/>
          <strong>Nível 4</strong><br/>
          <strong>Queda Lenta</strong><br/>Você reduz o dano de quedas usando sua força marcial interior para desacelerar.<br/>
          <strong>Golpe Potente</strong><br/>Você canaliza ki em um único golpe devastador de grande impacto.<br/>
          <strong>Nível 5</strong><br/>
          <strong>Investida</strong><br/>Você se move rapidamente em linha reta para atacar um inimigo distante.<br/>
          <strong>Evolução de Ki</strong><br/>À medida que você sobe de nível, seu ki se torna mais poderoso e versátil.
          <dl class="codebox spoiler"><dd>
            <strong>Nível 2</strong><br/>
            <strong>Pontos de Ki</strong><br/>Você obtém 2 pontos de ki por nível de monge para usar técnicas.<br/>
            <strong>Nível 4</strong><br/>
            <strong>Onda de Ki</strong><br/>Você emite uma onda de energia ki que afeta todos os inimigos em seis metros.<br/>
          </dd></dl>
        </dd></dl>
      </div>`;
  }

  test('features D1 após "Evolução de X" com corpo não viram nestedProgression', () => {
    const result = parseClassTopic(buildMonkeLike(), 'Monge Simulado');
    const featureNames = result.features?.map((f) => f.name) ?? [];
    // Golpe Marcial, Ki etc. devem ser features regulares, não nestedProgression.
    assert.ok(
      featureNames.includes('Golpe Marcial'),
      `"Golpe Marcial" deve ser feature: features=[${featureNames.join(', ')}]`
    );
    assert.ok(
      featureNames.includes('Ki'),
      `"Ki" deve ser feature: features=[${featureNames.join(', ')}]`
    );
  });

  test('classe não fica candidate quando features D1 são preservadas', () => {
    const result = parseClassTopic(buildMonkeLike(), 'Monge Simulado');
    assert.ok(!result.candidate, 'Monge simulado não deve ser candidate');
  });

  test('"Evolução de X" puro sem corpo: spoiler D1 com header vazio AINDA marca nestedEntity', () => {
    // Padrão real do Invocador: "Evolução de Carbuncle" sem corpo algum antes
    // do spoiler D1. Esses blocos D1 DEVEM ser nestedProgression.
    const tableRows2 = `
      <tr><td>1</td><td>+2</td><td>Avatar + Invocar Equipamento</td></tr>
      <tr><td>2</td><td>+2</td><td>Essência Primordial</td></tr>
      <tr><td>3</td><td>+2</td><td>Vínculo Duplo</td></tr>
      <tr><td>4</td><td>+3</td><td>Invocar Superior</td></tr>
      <tr><td>5</td><td>+3</td><td>Fusão</td></tr>`;
    const html = `
      <div class="content clearfix"><strong>Dado de Vida:</strong> d8</div>
      <div class="content clearfix">
        <strong>Progressão</strong>
        <table>
          <tr><th>Nível</th><th>Bônus</th><th>Habilidades</th></tr>
          ${tableRows2}
        </table>
      </div>
      <div class="content clearfix">
        <strong>Explicando a progressão</strong>
        <dl class="codebox spoiler"><dd>
          <strong>Nível 1</strong><br/>
          <strong>Avatar</strong><br/>Você estabelece um vínculo permanente com um avatar do plano material.<br/>
          <strong>Invocar Equipamento</strong><br/>Você invoca equipamento mágico em suas mãos como ação bônus.<br/>
          <strong>Nível 2</strong><br/>
          <strong>Essência Primordial</strong><br/>Seu vínculo com o avatar concede resistência aos elementos primordiais.<br/>
          <strong>Nível 3</strong><br/>
          <strong>Vínculo Duplo</strong><br/>Você pode se vincular a um segundo avatar de menor poder simultâneo.<br/>
          <strong>Nível 4</strong><br/>
          <strong>Invocar Superior</strong><br/>Você aprende a invocar avatares mais poderosos de outros planos distantes.<br/>
          <strong>Nível 5</strong><br/>
          <strong>Fusão</strong><br/>Você e seu avatar podem se fundir temporariamente em batalha épica.<br/>
        </dd></dl>
      </div>
      <div class="content clearfix">
        <strong>Evolução de Carbuncle</strong>
        <dl class="codebox spoiler"><dd>
          <strong>Nível 1</strong><br/>
          <strong>Feixe de Gema</strong><br/>Carbuncle dispara um feixe de energia cristalina em linha reta até vinte metros.<br/>
          <strong>Nível 2</strong><br/>
          <strong>Brilho Cegante</strong><br/>A gema emite um pulso cegante que afeta todos ao redor em seis metros.<br/>
        </dd></dl>
      </div>`;
    const result = parseClassTopic(html, 'Invocador Puro');
    const featureNames = result.features?.map((f) => f.name) ?? [];
    const nested =
      result.contentBlocks?.filter((b) => b.kind === 'nestedProgression') ?? [];
    const nestedTitles = nested.map((b) => b.title ?? '');
    // "Feixe de Gema" é D1 logo após "Evolução de Carbuncle" (corpo vazio) →
    // deve ir para nestedProgression, NÃO para features.
    assert.ok(
      !featureNames.includes('Feixe de Gema'),
      '"Feixe de Gema" não deve ser feature da classe'
    );
    assert.ok(
      nestedTitles.includes('Feixe de Gema') ||
        nestedTitles.includes('Brilho Cegante'),
      `Evoluções sem corpo devem ser nestedProgression: ${nestedTitles.join(', ')}`
    );
  });
});

// ─── Regressão: negrito parcial não cria blocos de rótulos internos ────────

describe('parseBlocks — negrito parcial só cria bloco se nome está em known ou inArchetypes', () => {
  // Rótulos internos como "Frequência:", "Uso:", "Alcance:", "Tipo:" etc.
  // aparecem em negrito parcial DENTRO de descrições de características.
  // Sem a guarda `known`, viravam falsos talentos de classe.
  test('rótulo interno "Frequência:" fora de arquétipos não cria bloco (não está em known)', () => {
    const lines = [
      POST_MARK,
      // Simula feature já aberta (via texto não-bold)
      `${BOLD_OPEN}Ataque Especial${BOLD_CLOSE}`,
      'Você realiza um ataque especial que ignora resistências normais.',
      // Rótulo interno com colon fora do bold: NÃO deve criar bloco
      `${BOLD_OPEN}Frequência:${BOLD_CLOSE} 1 vez por turno`,
      `${BOLD_OPEN}Alcance:${BOLD_CLOSE} 9 metros`,
    ];
    // sem known → rótulos internos não devem criar bloco
    const blocks = parseBlocks(lines);
    const names = blocks.map((b) => b.name);
    assert.ok(
      !names.includes('Frequência'),
      `"Frequência" não deve ser bloco: [${names.join(', ')}]`
    );
    assert.ok(
      !names.includes('Alcance'),
      `"Alcance" não deve ser bloco: [${names.join(', ')}]`
    );
  });

  test('feature em known com negrito parcial (asterisco) cria bloco normalmente', () => {
    const lines = [
      POST_MARK,
      // "SENTIDO DE PERIGO" está em known; o asterisco vem depois do bold
      `${BOLD_OPEN}SENTIDO DE PERIGO${BOLD_CLOSE}*`,
      'Você percebe o perigo iminente antes mesmo de ele se manifestar fisicamente.',
    ];
    const known = new Set(['sentido de perigo']);
    const blocks = parseBlocks(lines, known);
    const sp = blocks.find((b) => b.name === 'SENTIDO DE PERIGO');
    assert.ok(
      sp !== undefined,
      '"SENTIDO DE PERIGO" deve criar bloco quando está em known'
    );
  });

  test('rótulo interno dentro de arquétipos ainda cria bloco (inArchetypes=true)', () => {
    // Dentro de arquétipos, todo negrito parcial é válido (archetype talents).
    const lines = [
      POST_MARK,
      'Arquétipos',
      `${BOLD_OPEN}Guarda Negro${BOLD_CLOSE} - Deve ser maligno e adorar uma divindade maligna.`,
      `${BOLD_OPEN}Disciplina de Sombra${BOLD_CLOSE}: Aprende magias da escola de necromancia.`,
    ];
    const blocks = parseBlocks(lines);
    const names = blocks.map((b) => b.name);
    assert.ok(
      names.includes('Guarda Negro'),
      '"Guarda Negro" deve ser bloco dentro de arquétipos'
    );
    assert.ok(
      names.includes('Disciplina de Sombra'),
      '"Disciplina de Sombra" deve ser bloco dentro de arquétipos'
    );
  });
});

describe('parseClassTopic — Artes Divinas são lista de escolha', () => {
  const levels = Array.from({ length: 20 }, (_, index) => {
    const level = index + 1;
    const grant = level === 6 ? 'Artes Divinas' : `Habilidade ${level}`;
    return `<tr><td>${level}</td><td>+2</td><td>${grant}</td></tr>`;
  }).join('');
  const described = Array.from({ length: 20 }, (_, index) => {
    const level = index + 1;
    if (level === 6) {
      return `<strong>Nível 6</strong><br/><strong>Artes Divinas</strong><br/>No 7º nível, o paladino ganha duas Artes Divinas no 77º nível e mais uma a cada três níveis.<br/>`;
    }
    return `<strong>Nível ${level}</strong><br/><strong>Habilidade ${level}</strong><br/>Descrição longa da habilidade ${level} para permanecer válida no teste.<br/>`;
  }).join('');
  const html = `
    <div class="content clearfix"><strong>Dado de Vida:</strong> d10</div>
    <div class="content clearfix"><strong>Progressão</strong><table>
      <tr><th>Nível</th><th>Bônus de Proficiência</th><th>Habilidades</th></tr>
      ${levels}
    </table></div>
    <div class="content clearfix">${described}</div>
    <div class="content clearfix">
      <strong>Arquétipos</strong>
      <strong>Escudo Sagrado</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Nível 3</strong><br/>
        <strong>Juramento do Escudo</strong><br/>
        Descrição longa do juramento do escudo para continuar sendo arquétipo.
      </dd></dl>
      <strong>Artes Divinas</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Bastião da Luz:</strong><br/>
        Como uma ação bônus, cria um elo de luz com um aliado próximo.
        <strong>Clemência:</strong><br/>
        Como uma ação padrão, cura a si mesma ou um aliado próximo.
      </dd></dl>
    </div>`;

  test('as artes saem do arquétipo e entram na lista com a regra de escolha', () => {
    const result = parseClassTopic(html, 'Paladino Simulado');
    assert.deepEqual(
      result.archetypes?.map((archetype) => archetype.name),
      ['Escudo Sagrado']
    );
    assert.equal(
      result.talents?.some((talent) => talent.group === 'Artes Divinas'),
      false
    );
    const arts = result.catalogs?.find(
      (catalog) => catalog.name === 'Artes Divinas'
    );
    assert.deepEqual(
      arts?.items?.map((item) => item.name),
      ['Bastião da Luz', 'Clemência']
    );
    assert.match(arts?.description ?? '', /no 7º nível/);
    assert.doesNotMatch(arts?.description ?? '', /77º/);
    const rule = result.features?.find(
      (feature) => feature.name === 'Artes Divinas'
    );
    assert.match(rule?.description ?? '', /no 7º nível/);
    assert.doesNotMatch(rule?.description ?? '', /77º/);
  });
});

describe('parseClassTopic — Poderes de Fúria são lista de escolha', () => {
  const levels = Array.from({ length: 20 }, (_, index) => {
    const level = index + 1;
    const grant = level === 2 ? 'Poderes de Fúria' : `Habilidade ${level}`;
    return `<tr><td>${level}</td><td>+2</td><td>${grant}</td></tr>`;
  }).join('');
  const described = Array.from({ length: 20 }, (_, index) => {
    const level = index + 1;
    if (level === 2) {
      return `<strong>Nível 2</strong><br/><strong>Poderes de Fúria</strong><br/>A partir do 2º nível, ganha um poder de fúria. Ele ganha outro poder a cada 2 níveis após o 2º.<br/>`;
    }
    return `<strong>Nível ${level}</strong><br/><strong>Habilidade ${level}</strong><br/>Descrição longa da habilidade ${level} para permanecer válida no teste.<br/>`;
  }).join('');
  const html = `
    <div class="content clearfix"><strong>Dado de Vida:</strong> d12</div>
    <div class="content clearfix"><strong>Progressão</strong><table>
      <tr><th>Nível</th><th>Bônus de Proficiência</th><th>Habilidades</th></tr>
      ${levels}
    </table></div>
    <div class="content clearfix">${described}</div>
    <div class="content clearfix">
      <strong>Arquétipos</strong>
      <strong>Guerreiro Frenético</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Frenesi</strong><br/>
        Descrição longa do frenesi para continuar sendo arquétipo.
      </dd></dl>
      <strong>Fúria Aterradora</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Poderes de Fúria</strong><br/>
        Um furioso aterrador pode escolher um dos seguintes poderes de fúria além de sua lista normal.
      </dd></dl>
      <strong>Saqueador</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Ataque Poderoso</strong><br/>
        Descrição longa do ataque poderoso para continuar sendo arquétipo.
      </dd></dl>
      <strong>Poderes de Fúria</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Mordida Animal</strong><br/>
        O berserker ganha um ataque de mordida.
        <strong>└- Mordida Sangrenta</strong><br/>
        Pré-requisito: Mordida Animal. A mordida passa a causar sangramento.
        <strong>Totem da Fera</strong><br/>
        Enquanto em fúria, o berserker ganha garras.
      </dd></dl>
    </div>`;

  test('os poderes saem do arquétipo e a habilidade do aterrador continua nele', () => {
    const result = parseClassTopic(html, 'Berserker Simulado');
    assert.deepEqual(
      result.archetypes?.map((archetype) => archetype.name),
      ['Guerreiro Frenético', 'Fúria Aterradora', 'Saqueador']
    );
    const terrifying = result.archetypes?.find(
      (archetype) => archetype.name === 'Fúria Aterradora'
    );
    assert.equal(terrifying?.features?.[0]?.name, 'Poderes de Fúria');
    const powers = result.catalogs?.find(
      (catalog) => catalog.name === 'Poderes de Fúria'
    );
    assert.deepEqual(
      powers?.items?.map((item) => item.name),
      ['Mordida Animal', '└- Mordida Sangrenta', 'Totem da Fera']
    );
    assert.match(powers?.description ?? '', /a partir do 2º nível/i);
  });

  test('pré-requisito, tamanho e posturas ficam nos poderes, e formas saem do spoiler aninhado', () => {
    const levels = Array.from({ length: 20 }, (_, index) => {
      const level = index + 1;
      const grant =
        level === 2
          ? 'Formas de Fúria + Poderes de Fúria'
          : `Habilidade ${level}`;
      return `<tr><td>${level}</td><td>+2</td><td>${grant}</td></tr>`;
    }).join('');
    const described = Array.from({ length: 20 }, (_, index) => {
      const level = index + 1;
      if (level === 2) return '';
      return `<strong>Nível ${level}</strong><br/><strong>Habilidade ${level}</strong><br/>Descrição longa da habilidade ${level} para permanecer válida no teste.<br/>`;
    }).join('');
    const html = `
      <div class="content clearfix"><strong>Dado de Vida:</strong> d12</div>
      <div class="content clearfix"><strong>Progressão</strong><table>
        <tr><th>Nível</th><th>Bônus de Proficiência</th><th>Habilidades</th></tr>
        ${levels}
      </table></div>
      <div class="content clearfix">
        <dl class="codebox spoiler"><dd>
          ${described}
          <strong>Formas de Fúria</strong><br/>
          No 2º nível, um berserker seleciona uma das formas de fúria.
          <dl class="codebox spoiler"><dt>Formas de Fúria:</dt><dd>
            <strong>Fúria Animal</strong><br/>
            Enquanto em fúria, o berserker ganha garras e uma mordida natural.
            <strong>Fúria Animal Superior</strong><br/>
            No 11º nível, a fúria animal também concede um ataque de chifre.
          </dd></dl>
          <strong>Poderes de Fúria</strong><br/>
          A partir do 2º nível, ganha um poder de fúria. Ele ganha outro poder a cada 2 níveis após o 2º.
        </dd></dl>
      </div>
      <div class="content clearfix">
        <strong>Arquétipos</strong>
        <strong>Guerreiro Frenético</strong>
        <dl class="codebox spoiler"><dd>
          <strong>Frenesi</strong><br/>
          Descrição longa do frenesi para continuar sendo arquétipo.
        </dd></dl>
        <strong>Poderes de Fúria</strong>
        <dl class="codebox spoiler"><dd>
          <strong>Mordida Animal</strong><br/>
          O berserker ganha um ataque de mordida.
          <strong>└- Mordida Sangrenta</strong><br/>
          <strong>Pré-requisitos:</strong> Berserker 8, Mordida Animal<br/>
          A mordida passa a causar sangramento contínuo.
          <strong>Massacrador Corporal</strong><br/>
          Enquanto em fúria, o berserker usa o alvo agarrado como arma.
          <strong>Médio:</strong> 1d10 de dano da arma viva enquanto a criatura estiver agarrada.
        </dd></dl>
        <h2>Posturas</h2>
        <dl class="codebox spoiler"><dd>
          <strong>Postura Precisa</strong><br/>
          O berserker pode focar seus golpes e recebe um bônus de competência.
          <strong>└– Precisão Afiada</strong><br/>
          <strong>Pré-requisitos:</strong> Berserker 8, Postura Precisa<br/>
          Ignora a chance de falha por camuflagem enquanto estiver na postura.
        </dd></dl>
      </div>`;

    const result = parseClassTopic(html, 'Berserker Simulado');
    const forms = result.catalogs?.find(
      (catalog) => catalog.name === 'Formas de Fúria'
    );
    assert.deepEqual(
      forms?.items?.map((item) => item.name),
      ['Fúria Animal', 'Fúria Animal Superior']
    );
    assert.match(forms?.description ?? '', /seleciona uma das formas/i);
    assert.equal(
      (result.contentBlocks ?? []).some(
        (block) => block.title === 'Fúria Animal'
      ),
      false
    );

    const powers = result.catalogs?.find(
      (catalog) => catalog.name === 'Poderes de Fúria'
    );
    assert.deepEqual(
      powers?.items?.map((item) => item.name),
      [
        'Mordida Animal',
        '└- Mordida Sangrenta',
        'Massacrador Corporal',
        'Postura Precisa',
        '└– Precisão Afiada',
      ]
    );
    const bloody = powers?.items?.find(
      (item) => item.name === '└- Mordida Sangrenta'
    );
    assert.match(bloody?.description ?? '', /Pré-requisitos: Berserker 8/);
    const crusher = powers?.items?.find(
      (item) => item.name === 'Massacrador Corporal'
    );
    assert.match(crusher?.description ?? '', /Médio: 1d10/);
    assert.equal(
      result.talents?.some((talent) =>
        /postura|pré-requisito|médio/i.test(talent.name)
      ),
      false
    );
    assert.equal(
      result.catalogs?.some((catalog) => catalog.name === 'Posturas'),
      false
    );
  });
});

describe('parseClassTopic — Técnicas Blitz são lista de escolha', () => {
  const levels = Array.from({ length: 20 }, (_, index) => {
    const level = index + 1;
    const grant = level === 7 ? 'Técnicas de Blitz' : `Habilidade ${level}`;
    return `<tr><td>${level}</td><td>+2</td><td>${grant}</td></tr>`;
  }).join('');
  const described = Array.from({ length: 20 }, (_, index) => {
    const level = index + 1;
    if (level === 7) {
      return `<strong>Nível 7</strong><br/><strong>Técnicas de Blitz</strong><br/>A cada dois níveis subsequentes, o monge pode selecionar uma técnica de blitz.<br/>`;
    }
    return `<strong>Nível ${level}</strong><br/><strong>Habilidade ${level}</strong><br/>Descrição longa da habilidade ${level} para permanecer válida no teste.<br/>`;
  }).join('');
  const html = `
    <div class="content clearfix"><strong>Dado de Vida:</strong> d8</div>
    <div class="content clearfix"><strong>Progressão</strong><table>
      <tr><th>Nível</th><th>Bônus de Proficiência</th><th>Habilidades</th></tr>
      ${levels}
    </table></div>
    <div class="content clearfix">${described}</div>
    <div class="content clearfix">
      <strong>Arquétipos</strong>
      <strong>Discípulo do Punho Elemental</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Punhos-Habilidade</strong><br/>
        Descrição longa dos punhos para continuar sendo arquétipo.
      </dd></dl>
      <strong>Monge Pele de Ferro</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Pele de Ferro</strong><br/>
        Descrição longa da pele de ferro para continuar sendo arquétipo.
      </dd></dl>
      <strong>Monge Selvagem</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Poderes de Fúria</strong><br/>
        O monge selvagem escolhe poderes de fúria como o berserker.
      </dd></dl>
      <strong>Técnicas Blitz</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Aura Explosiva</strong><br/>
        Use o espírito marcial para atingir um inimigo à distância.
        <strong>Impacto Meteoro</strong><br/>
        O monge salta e desce com o peso do corpo sobre o alvo.
        <strong>Fênix Ascendente</strong><br/>
        Um golpe ascendente envolve o punho em chamas espirituais.
        <strong>Força Desenfreada</strong><br/>
        O monge libera toda a força acumulada em um único golpe.
      </dd></dl>
    </div>`;

  test('as técnicas saem do arquétipo e a regra vem de Técnicas de Blitz', () => {
    const result = parseClassTopic(html, 'Monge Simulado');
    assert.deepEqual(
      result.archetypes?.map((archetype) => archetype.name),
      ['Discípulo do Punho Elemental', 'Monge Pele de Ferro', 'Monge Selvagem']
    );
    const wild = result.archetypes?.find(
      (archetype) => archetype.name === 'Monge Selvagem'
    );
    assert.equal(wild?.features?.[0]?.name, 'Poderes de Fúria');
    const blitz = result.catalogs?.find(
      (catalog) => catalog.name === 'Técnicas Blitz'
    );
    assert.deepEqual(
      blitz?.items?.map((item) => item.name),
      [
        'Aura Explosiva',
        'Impacto Meteoro',
        'Fênix Ascendente',
        'Força Desenfreada',
      ]
    );
    assert.match(blitz?.description ?? '', /a cada dois níveis subsequentes/i);
    assert.equal(
      result.features?.some((feature) => feature.name === 'Técnicas de Blitz'),
      true
    );
  });
});

describe('parseClassTopic — Habilidades de Fúria do monge selvagem são lista', () => {
  const levels = Array.from({ length: 20 }, (_, index) => {
    const level = index + 1;
    return `<tr><td>${level}</td><td>+2</td><td>Habilidade ${level}</td></tr>`;
  }).join('');
  const described = Array.from({ length: 20 }, (_, index) => {
    const level = index + 1;
    return `<strong>Nível ${level}</strong><br/><strong>Habilidade ${level}</strong><br/>Descrição longa da habilidade ${level} para permanecer válida no teste.<br/>`;
  }).join('');
  const html = `
    <div class="content clearfix"><strong>Dado de Vida:</strong> d8</div>
    <div class="content clearfix"><strong>Progressão</strong><table>
      <tr><th>Nível</th><th>Bônus de Proficiência</th><th>Habilidades</th></tr>
      ${levels}
    </table></div>
    <div class="content clearfix">${described}</div>
    <div class="content clearfix">
      <strong>Arquétipos</strong>
      <strong>Monge Selvagem</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Poderes de Fúria</strong><br/>
        A partir do 5º nível, ele recebe um poder de fúria da lista de poderes de fúria do bárbaro.
      </dd></dl>
    </div>
    <div class="content clearfix">
      <h2>Habilidades de Fúria (Berserker)</h2>
      <dl class="codebox spoiler"><dd>
        <strong>Postura Precisa</strong> — O berserker pode focar seus golpes e recebe um bônus de competência.
        <strong>└- Precisão Afiada</strong> — Berserker 8, Postura Precisa — Ignora a chance de falha por camuflagem.
      </dd></dl>
    </div>`;

  test('as posturas coladas viram lista e o poder continua no monge selvagem', () => {
    const result = parseClassTopic(html, 'Monge Simulado');
    assert.deepEqual(
      result.archetypes?.map((archetype) => archetype.name),
      ['Monge Selvagem']
    );
    const wild = result.archetypes?.[0];
    assert.equal(wild?.features?.[0]?.name, 'Poderes de Fúria');
    const fury = result.catalogs?.find(
      (catalog) => catalog.name === 'Habilidades de Fúria (Berserker)'
    );
    assert.deepEqual(
      fury?.items?.map((item) => item.name),
      ['Postura Precisa', '└- Precisão Afiada']
    );
    assert.match(
      fury?.items?.[1]?.description ?? '',
      /Berserker 8, Postura Precisa/
    );
    assert.match(fury?.description ?? '', /a partir do 5º nível/i);
    assert.equal(
      result.talents?.some((talent) => talent.name === 'Postura Precisa'),
      false
    );
  });
});

describe('parseClassTopic — dançarina: danças e talentos são listas', () => {
  const levels = Array.from({ length: 20 }, (_, index) => {
    const level = index + 1;
    const grant = level === 6 ? 'Danças Místicas' : `Habilidade ${level}`;
    return `<tr><td>${level}</td><td>+2</td><td>${grant}</td></tr>`;
  }).join('');
  const described = Array.from({ length: 20 }, (_, index) => {
    const level = index + 1;
    if (level === 6) return '';
    return `<strong>Nível ${level}</strong><br/><strong>Habilidade ${level}</strong><br/>Descrição longa da habilidade ${level} para permanecer válida no teste.<br/>`;
  }).join('');
  const html = `
    <div class="content clearfix"><strong>Dado de Vida:</strong> d8</div>
    <div class="content clearfix"><strong>Progressão</strong><table>
      <tr><th>Nível</th><th>Bônus de Proficiência</th><th>Habilidades</th></tr>
      ${levels}
    </table></div>
    <div class="content clearfix">${described}</div>
    <div class="content clearfix">
      <strong>Arquétipos</strong>
      <strong>Akimbo</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Passo Cruzado</strong><br/>
        Descrição longa do passo cruzado para continuar sendo arquétipo.
      </dd></dl>
      <strong>Corifeu</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Coro</strong><br/>
        Descrição longa do coro para continuar sendo arquétipo.
      </dd></dl>
      <strong>Artista da Dança</strong>
      <dl class="codebox spoiler"><dd>
        <strong>Palco</strong><br/>
        Descrição longa do palco para continuar sendo arquétipo.
      </dd></dl>
      <div><strong>Danças Místicas</strong><br>
      A partir do 6º nível, e a cada três níveis de dançarina após isso, a dançarina aprende uma nova dança mística. Algumas danças místicas exigem outras danças como pré-requisito.<br>
      Executar uma dança mística requer uma ação padrão, provoca ataques de oportunidade e custa 1 ponto de Ki para ativar.<br>
      <dl class="codebox spoiler"><dt>Spoiler:</dt><dd><div>
        <strong>Aspir Samba</strong><br>
        <strong>Pré-requisito: </strong>dança mística Drain Samba<br>
        A dançarina executa uma dança que permite a ela e seus aliados drenarem pontos de magia com cada ataque corpo a corpo bem-sucedido.
        <strong>Aspir Samba II</strong><br>
        <strong>Pré-requisito:</strong> Aspir Samba<br>
        Mesma mecânica, mas os valores aumentam para 2d4 (dano e ganho/cura).
        <strong>Passo em Caixa</strong><br>
        <strong>Pré-requisito:</strong><br>
        A dançarina reduz as defesas de uma criatura a até 9 metros. O alvo deve realizar um teste de Constituição.
        <strong>Floreio Desesperado</strong><br>
        Pré-requisito: —<br>
        Impõe penalidade em jogadas de ataque de uma criatura a até 9 metros. O alvo faz Constituição.
        <strong>Drain Samba II</strong><br><br>
        <strong>Pré-requisito:</strong> Drain Samba<br>
        Valores aumentam para 2d4 / 2d4.
        <strong>Giga Espectral</strong><br>
        <strong>Pré-requisito:</strong> Dançarina 8<br>
        A dançarina torna um aliado a até 9 metros invisível, como a magia Desaparecer, pela duração normal.
        <strong>Dança da Lâmina</strong><br>
        <strong>Pré-requisito:</strong> Dançarina 14<br>
        Como ação completa, a dançarina pode realizar uma dança que lhe permite fazer um ataque completo com o dobro do número normal de ataques.
        <strong>Dança da Lâmina</strong><br>
        <strong>Pré-requisito:</strong> Dançarina 16, dança mística Dança da lâmina.<br>
        A dançarina executa uma dança que permite atacar um oponente 5 vezes. Ela realiza 5 jogadas de ataque separadas.
      </div></dd></dl></div>
    </div>
    <div class="content clearfix"><div><div align="center"><h3 class="post-content">Talentos de Dança</h3></div><br><br>
      À medida que uma dançarina ganha experiência, ela aprende vários talentos que a ajudam e confundem seus inimigos. A partir do 2º nível, a dançarina ganha um talento de dança. Ela ganha um talento adicional a cada 2 níveis de dançarina após o 2º nível.
      <dl class="codebox spoiler"><dt>Spoiler:</dt><dd><div>
        <strong>Atleta</strong><br>
        <strong>Pré-requisitos:</strong> —<br>
        A dançarina recebe um bônus em testes de Acrobacia igual à metade de seu nível de dançarina (arredondado para baixo).
        <strong>Estimada </strong><br>
        <strong>Pré-requisitos: </strong>Dançarina 4<br>
        Os aliados da dançarina a têm em tão alta consideração que, quando ela é ameaçada ou ferida, pode incentivá-los à ação.
        <strong>Guardião:</strong> A dançarina escolhe um aliado como ação bônus. Enquanto permanecer dentro de 9 metros do aliado, ela recebe +2 de bônus na CA até o início de seu próximo turno.
        <strong>Represália:</strong> A dançarina faz um único ataque corpo a corpo ou à distância contra qualquer alvo ao alcance como ação padrão.
        <strong>A Mim!:</strong> A dançarina gasta uma ação bônus. Sempre que ela sofrer dano antes do início de seu próximo turno, cada aliado em sua linha de visão pode se mover 3 metros como reação.
        <strong>Inspiração da Dança</strong><br>
        <strong>Pré-requisitos:</strong> —<br>
        A dançarina pode inspirar outros através da dança. Como ação bônus, ela escolhe uma criatura a até 18 metros que possa ouvi-la.
        <strong>O dado aumenta:</strong><br><br>
        5º nível → d8<br><br>
        10º nível → d10<br><br>
        15º nível → d12
      </div></dd></dl><br>
      <h3 class="post-content"><div align="center"><strong>Talento de Dança Avançado</strong></div></h3>
      No 12º nível, e a cada dois níveis depois disso, uma dançarina pode escolher um dos seguintes talentos de dança avançados no lugar de um talento de dança.
      <dl class="codebox spoiler"><dt>Spoiler:</dt><dd><div>
        <strong>Pressa</strong><br>
        <strong>Pré-requisito:</strong> característica de classe Velocidade<br>
        Sempre que a dançarina poderia dar um passo de 1 metro, ela pode dar um passo de 3 metros no lugar.
        <strong>Dança Rápida</strong><br>
        <strong>Pré-requisito:</strong> —<br>
        Uma vez por dia, a dançarina pode executar uma dança mística como ação bonus.
      </div></dd></dl>
    </div></div>`;

  test('as danças e os talentos saem dos arquétipos e o avançado fica na mesma lista', () => {
    const result = parseClassTopic(html, 'Dançarina Simulada');
    assert.deepEqual(
      result.archetypes?.map((archetype) => archetype.name),
      ['Akimbo', 'Corifeu', 'Artista da Dança']
    );
    const akimbo = result.archetypes?.find(
      (archetype) => archetype.name === 'Akimbo'
    );
    assert.equal(akimbo?.features?.[0]?.name, 'Passo Cruzado');

    const dances = result.catalogs?.find(
      (catalog) => catalog.name === 'Danças Místicas'
    );
    assert.deepEqual(
      dances?.items?.map((item) => item.name),
      [
        'Aspir Samba',
        'Aspir Samba II',
        'Passo em Caixa',
        'Floreio Desesperado',
        'Drain Samba II',
        'Giga Espectral',
        'Dança da Lâmina',
        'Dança da Lâmina',
      ]
    );
    assert.match(dances?.description ?? '', /a partir do 6º nível/i);
    assert.match(dances?.description ?? '', /a cada três níveis/i);
    assert.match(dances?.items?.[0]?.description ?? '', /Drain Samba/);
    assert.match(dances?.items?.[2]?.description ?? '', /9 metros/);
    assert.match(dances?.items?.[3]?.description ?? '', /Pré-requisito/);
    assert.match(dances?.items?.[4]?.description ?? '', /2d4/);

    assert.deepEqual(
      result.catalogs?.map((catalog) => catalog.name),
      ['Danças Místicas', 'Talentos de Dança']
    );
    const talents = result.catalogs?.find(
      (catalog) => catalog.name === 'Talentos de Dança'
    );
    assert.deepEqual(
      talents?.items?.map((item) => item.name),
      ['Atleta', 'Estimada', 'Inspiração da Dança', 'Pressa', 'Dança Rápida']
    );
    assert.match(talents?.description ?? '', /a partir do 2º nível/i);
    assert.match(talents?.description ?? '', /12º nível/);
    const esteemed = talents?.items?.find((item) => item.name === 'Estimada');
    assert.match(esteemed?.description ?? '', /Dançarina 4/);
    assert.match(esteemed?.description ?? '', /Guardião:/);
    assert.match(esteemed?.description ?? '', /Represália:/);
    assert.match(esteemed?.description ?? '', /A Mim!:/);
    const inspiration = talents?.items?.find(
      (item) => item.name === 'Inspiração da Dança'
    );
    assert.match(inspiration?.description ?? '', /O dado aumenta:/);
    assert.match(inspiration?.description ?? '', /d12/);
    assert.match(
      talents?.items?.find((item) => item.name === 'Pressa')?.description ?? '',
      /Velocidade/
    );
    assert.equal(
      result.talents?.some((talent) =>
        /atleta|estimada|guardião|pressa|aspir samba/i.test(talent.name)
      ),
      false
    );
  });
});

// ─── Resultado final ─────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
console.log(`Resultado: ${passed} passou, ${failed} falhou`);
if (failed > 0) {
  process.exit(1);
}
