// Prefixo `pick*`, nunca `class*`: useCssHandles não escopa nada.
const ClassCardHandles = [
  'pickCard',
  'pickArt',
  'pickArtImage',
  'pickSigil',
  'pickSigilRing',
  'pickSigilRole',
  'pickTop',
  'pickKind',
  'pickEdit',
  'pickSpacer',
  'pickHead',
  'pickUnique',
  'pickName',
  'pickNameLink',
  'pickClasp',
  'pickBody',
  'pickDesc',
  'pickStats',
  'pickGroup',
  'pickGroupTitle',
  'pickRows',
  'pickMore',
] as const;

export default ClassCardHandles;
