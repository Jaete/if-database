// Prefixados: useCssHandles não escopa nada, e nomes como `header`/`row` já
// existem em outras folhas deste projeto.
const SpellGridHandles = [
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
  'grimoireCircle',
  'grimoireName',
  'grimoireMeta',
  'grimoireEmpty',
] as const;

export default SpellGridHandles;
