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
  'codexAction',
  'codexActionLabel',
  'codexFeedback',
  'codexFeedbackError',
  'codexEmbedHead',
  'codexEmpty',
  'codexOverlay',
] as const;

export default ClassGridHandles;
