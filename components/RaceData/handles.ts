// Prefixo `race*`: useCssHandles não escopa nada. Aqui vivem a casca da página
// e as peças que as seções dividem; cada componente filho tem os seus.
const RaceDataHandles = [
  'raceDetail',
  'raceStage',
  'raceAmbient',
  'raceBody',
  'raceMain',
  'raceSecHead',
  'raceWarn',
  'raceNotes',
  'raceNotesEdit',
  'raceTier',
  'raceBaseOnly',
  'raceBaseOnlyHead',
  'racePillBase',
  'raceToast',
] as const;

export default RaceDataHandles;
