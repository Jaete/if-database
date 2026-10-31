// Prefixo `embedEntry*`: useCssHandles não escopa nada e as folhas dos
// embeds convivem na mesma página.
const EmbedEntryHandles = [
  'embedEntry',
  'embedEntryHeading',
  'embedEntryPanel',
  'embedEntryArt',
  'embedEntryShade',
  'embedEntryBody',
  'embedEntryMark',
  'embedEntryTitle',
  'embedEntrySub',
  'embedEntryCta',
] as const;

export default EmbedEntryHandles;
