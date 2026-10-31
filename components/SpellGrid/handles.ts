// Prefixados: useCssHandles não escopa nada, e nomes como `header`/`row` já
// existem em outras folhas deste projeto.
const SpellGridHandles = [
  'spellbook',
  'spellbookInner',
  'spellbookHeader',
  'spellbookTitle',
  'spellbookSubtitle',
  'spellbookTools',
  'spellbookSearchWrap',
  'spellbookSearchIcon',
  'spellbookSearch',
  'spellbookActions',
  'spellbookButton',
  'spellbookImport',
  'spellbookFeedback',
  'spellbookFeedbackError',
  'spellbookCount',
  'spellbookEmbedHead',
  'spellbookBody',
  'spellbookIndex',
  'spellbookIndexItem',
  'spellbookGroups',
  'spellbookGroup',
  'spellbookGroupHead',
  'spellbookGroupTitle',
  'spellbookGroupRule',
  'spellbookGroupCount',
  'spellbookList',
  'spellbookEmpty',
] as const;

export default SpellGridHandles;
