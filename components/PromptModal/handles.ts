// Prefixados de propósito: useCssHandles não escopa nada, e nomes genéricos
// como `body`/`actions` já são usados por outros modais deste projeto.
const PromptModalHandles = [
  'promptBody',
  'promptLabel',
  'promptInput',
  'promptArea',
  'promptActions',
  'promptSpacer',
  'promptDelete',
  'promptCancel',
  'promptConfirm',
] as const;

export default PromptModalHandles;
