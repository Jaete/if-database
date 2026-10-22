/**
 * Reaproveita as classes do seletor de magias: o `useCssHandles` deste projeto
 * é identidade, então declarar o mesmo nome aqui rende a mesma classe global —
 * e os dois seletores são a mesma coisa na tela, uma lista buscável dentro de
 * um modal. Ver styles/components/playerSheet/_panels.scss.
 */
const ArchetypePickerHandles = [
  'sheetPicker',
  'sheetPickerNote',
  'sheetPickerSearch',
  'sheetPickerList',
  'sheetPickerOption',
  'sheetPickerName',
  'sheetPickerTaken',
  // Próprias deste seletor: a habilidade de arquétipo se escolhe pela
  // descrição, que não cabe na linha do nome como o `meta` curto das magias.
  'sheetPickerHead',
  'sheetPickerDesc',
] as const;

export default ArchetypePickerHandles;
