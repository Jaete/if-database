/**
 * Reaproveita as classes do grimório: o `useCssHandles` deste projeto é
 * identidade, então declarar o mesmo nome aqui rende a mesma classe global, e
 * as duas páginas são o mesmo objeto na tela — cabeçalho, busca, lista de
 * linhas clicáveis. Ver styles/components/spellGrid.scss.
 *
 * Só o filtro por categoria é próprio: o grimório filtra por nome e pronto,
 * enquanto o talento geral vem agrupado em oito categorias pelo fórum.
 */
const TalentGridHandles = [
  'grimoire',
  'grimoireHeader',
  'grimoireTitle',
  'grimoireSubtitle',
  'grimoireTools',
  'grimoireSearch',
  'grimoireActions',
  'grimoireButton',
  'grimoireImport',
  'grimoireFeedback',
  'grimoireFeedbackError',
  'grimoireCount',
  'grimoireList',
  'grimoireRow',
  'grimoireName',
  'grimoireMeta',
  'grimoireEmpty',
  'talentCategory',
  'talentFilter',
] as const;

export default TalentGridHandles;
