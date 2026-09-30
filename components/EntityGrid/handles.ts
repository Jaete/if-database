// Os nomes mantêm o prefixo `cg` e a folha de estilo continua sendo
// `citizenGrid.scss`: este componente saiu de CitizenGrid e passou a servir
// também jogadores, e renomear o prefixo obrigaria a reescrever a SCSS inteira
// sem ganho visual nenhum.
const EntityGridHandles = [
  'cgContainer',
  'cgHeaderSentinel',
  'cgHeader',
  'cgTitle',
  'cgSubtitle',
  'cgNavButtons',
  'cgNavButton',
  'cgSearchContainer',
  'cgSearchInput',
  'cgResultsCount',
  'cgGrid',
  'cgGridLoading',
  'cgGridSkeleton',
  'cgEmptyState',
  'cgCompactSearchBar',
  'cgCompactSearchInput',
  'cgCompactActionBtn',
] as const;

export default EntityGridHandles;
