import { stripUnsafeKeys } from '@/lib/sanitize';
import type IPlayer from './player';

// Whitelist of what the public embed (components/PlayerSheet) renders. New
// schema fields stay private until added here on purpose.
export const PLAYER_PUBLIC_FIELDS = [
  '_id',
  // Em que ponto da criação a ficha está; ausente = ficha antiga, já aceita.
  'status',
  'name',
  'race',
  'gender',
  'class',
  // O vínculo com o códice: é dele que saem as características que a classe
  // concede no nível da ficha (ver services/classFeatures.service.ts).
  'classId',
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
  // A escolha de arquétipo é feita na ficha embutida, então entra gravável.
  'archetype',
  // Raça e talentos: a escolha entra gravável (como o arquétipo); o que ela
  // resolve em habilidades, linhagem e marcos é derivado na leitura.
  'raceId',
  'raceChoice',
  'talents',
  'talentMilestones',
  // Subida de nível: legíveis por todos, graváveis só pelos serviços de nível.
  'levelLocks',
  'featureChoices',
  'novelties',
  'equipment',
  'professions',
  'appearance',
  'backstory',
  'narrationStyle',
  'ownerUsername',
  'forumTopicUrl',
  'importedAt',
  // Carregado junto para que a edição embutida possa detectar que outra pessoa
  // gravou a ficha entre a leitura e o save (ver app/api/embed/players).
  'updatedAt',
] as const;

// `lineage` e `talentSlots` não estão na lista de propósito: são derivados na
// leitura (services/player.service.ts), então não são projetados do banco e
// também não são graváveis.
export type IPublicPlayer = Pick<
  IPlayer,
  (typeof PLAYER_PUBLIC_FIELDS)[number]
> &
  Pick<IPlayer, 'lineage' | 'talentSlots'>;

// Campos que a edição embutida pode gravar: a projeção pública menos as chaves
// e a trilha de procedência. `_id` e `slug` identificam o documento, e o bloco
// de posse/importação é escrito pelo importador do fórum, nunca por uma edição
// de ficha. `updatedAt` é do Mongoose.
export const PLAYER_WRITABLE_FIELDS = PLAYER_PUBLIC_FIELDS.filter(
  (field) =>
    ![
      '_id',
      'ownerUsername',
      'forumTopicUrl',
      'importedAt',
      'updatedAt',
      'status',
      // A XP só entra por "Conceder XP" e a subida só por selo: nunca por
      // edição de campo.
      'experience',
      'level',
      'levelLocks',
      'featureChoices',
      'novelties',
    ].includes(field)
) as readonly string[];

const WRITABLE = new Set(PLAYER_WRITABLE_FIELDS);

/**
 * Mantém apenas os campos graváveis do corpo recebido, já sem as chaves que o
 * Mongo leria como operador ou caminho.
 *
 * Esta lista é a do embed, deliberadamente mais estreita que a do editor
 * completo do app: o embed edita conteúdo de ficha, e nada de chave, posse ou
 * procedência. O editor do app grava campos que nem aparecem aqui (`slug`,
 * `description`, `rarity`, `icon`), então não pode usar este filtro.
 */
export function pickWritablePlayerFields(
  body: unknown
): Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {};

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(stripUnsafeKeys(body))) {
    if (!WRITABLE.has(key)) continue;
    out[key] = value;
  }
  return out;
}
