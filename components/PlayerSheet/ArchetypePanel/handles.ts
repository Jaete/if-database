/**
 * As linhas e o leitor são os mesmos das características — é a mesma lista,
 * com a mesma afordância de ler a descrição. O `useCssHandles` deste projeto é
 * identidade, então declarar o nome aqui rende a mesma classe global.
 */
const ArchetypePanelHandles = [
  'sheetMasterLayout',
  'sheetMasterList',
  'sheetMasterGroup',
  'sheetMasterRow',
  'sheetMasterName',
  'sheetMasterSummary',
  'sheetMasterOrigin',
  'sheetMasterRead',
  'sheetMasterEdit',
  'sheetMasterAdd',
  'sheetReader',
  'sheetReaderKicker',
  'sheetReaderText',
  'sheetEmpty',
  'sheetCaption',
  'sheetArchetypeSelect',
  'sheetArchetypeNote',
] as const;

export default ArchetypePanelHandles;
