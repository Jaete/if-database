// Prefixo `cls*` para tudo do detalhe da classe: useCssHandles não escopa nada.
// Aqui vivem a casca da página e os controles que as seções dividem.
const ClassDataHandles = [
  'clsPage',
  'clsBody',
  'clsIconBtn',
  'clsGhostBtn',
  'clsBtn',
  'clsToast',
] as const;

export default ClassDataHandles;
