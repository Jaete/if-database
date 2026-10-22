/**
 * Os quatro primeiros são do próprio formulário (ver
 * styles/components/citizenEditForm.scss) — este bloco é mais uma seção da
 * ficha, e repetir a aparência em classes próprias faria ele divergir do resto
 * no primeiro ajuste de estilo.
 */
const ArchetypeSelectHandles = [
  'section',
  'sectionTitle',
  'fieldGroup',
  'label',
  'select',
  'archetypeHint',
  'archetypeList',
  'archetypeItem',
  'archetypeRemove',
] as const;

export default ArchetypeSelectHandles;
