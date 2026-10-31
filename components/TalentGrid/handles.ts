/**
 * Os nomes `grimoire*` vêm do tempo em que o grimório e o catálogo de talentos
 * eram a mesma tela; as regras agora moram em styles/components/talentGrid.scss.
 * O grimório usa `spellbook*`.
 */
const TalentGridHandles = [
  'grimoire',
  'grimoireHeader',
  'grimoireTitle',
  'grimoireSubtitle',
  'grimoireTools',
  'grimoireSearch',
  'grimoireActions',
  'grimoireButton',
  'grimoireImport',
  'grimoireFeedback',
  'grimoireFeedbackError',
  'grimoireCount',
  'grimoireList',
  'grimoireRow',
  'grimoireName',
  'grimoireMeta',
  'grimoireEmpty',
  'talentCategory',
  'talentFilter',
] as const;

export default TalentGridHandles;
