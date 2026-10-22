/**
 * As três primeiras são as do próprio formulário (ver
 * styles/components/citizenEditForm.scss): este seletor é mais um campo da
 * ficha, e repetir a aparência em classes próprias faria ele divergir do
 * resto no primeiro ajuste de estilo. `.select` já existia na folha, estilizado
 * junto com `.input`, esperando um seletor que o usasse.
 */
const ClassSelectHandles = [
  'fieldGroup',
  'label',
  'select',
  'input',
  'classSelectHint',
] as const;

export default ClassSelectHandles;
