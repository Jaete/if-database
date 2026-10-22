// Prefixo `codex*`, nunca `class*`: useCssHandles não escopa nada, e um
// seletor global `.className`/`.classList` seria um campo minado.
const ClassGridHandles = [
  'codex',
  'codexHeader',
  'codexTitle',
  'codexSubtitle',
  'codexTools',
  'codexSearch',
  'codexActions',
  'codexButton',
  'codexAction',
  'codexActionLabel',
  'codexFeedback',
  'codexFeedbackError',
  'codexCount',
  'codexList',
  'codexRow',
  'codexBadge',
  'codexName',
  'codexNameCell',
  'codexUnique',
  'codexMeta',
  'codexEmpty',
] as const;

export default ClassGridHandles;
