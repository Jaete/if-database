import type IPlayer from './player';

// Whitelist of what the public embed (components/PlayerSheet) renders. New
// schema fields stay private until added here on purpose.
export const PLAYER_PUBLIC_FIELDS = [
  '_id',
  'name',
  'race',
  'gender',
  'class',
  'age',
  'height',
  'size',
  'type',
  'alignment',
  'family',
  'clan',
  'kingdom',
  'deity',
  'subtitle',
  'image',
  'level',
  'experience',
  'chi',
  'proficiencyBonus',
  'combat',
  'stats',
  'playerStats',
  'proficiencies',
  'defenses',
  'senses',
  'languages',
  'abilities',
  'traits',
  'actions',
  'bonusActions',
  'reactions',
  'legendaryActions',
  'playerSpellcasting',
  'equipment',
  'professions',
  'appearance',
  'backstory',
  'ownerUsername',
  'forumTopicUrl',
  'importedAt',
] as const;

export type IPublicPlayer = Pick<
  IPlayer,
  (typeof PLAYER_PUBLIC_FIELDS)[number]
>;
