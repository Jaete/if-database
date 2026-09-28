import type ICitizen from '@/db/citizens/citizen.d';

export const useCitizenData = (citizen: ICitizen) => {
  const hasPlayerStats = !!citizen.playerStats;
  const hasProficiencies =
    !!citizen.proficiencies?.weapons?.length ||
    !!citizen.proficiencies?.armor?.length ||
    !!citizen.proficiencies?.tools?.length;
  const hasSavingThrows = !!citizen.proficiencies?.savingThrows?.length;
  const hasSkills = !!citizen.proficiencies?.skills?.length;
  const hasAbilities = !!citizen.abilities?.length;
  const hasProfessions = !!citizen.professions?.length;
  const hasEquipment =
    citizen.equipment?.head ||
    citizen.equipment?.torso ||
    citizen.equipment?.legs ||
    citizen.equipment?.feet ||
    citizen.equipment?.hand ||
    citizen.equipment?.offhand ||
    citizen.equipment?.accessory1 ||
    citizen.equipment?.accessory2 ||
    citizen.equipment?.gil !== undefined ||
    citizen.equipment?.backpack?.length;
  const hasSpellcasting = !!citizen.playerSpellcasting;
  const hasDefenses =
    !!citizen.defenses?.resistances?.length ||
    !!citizen.defenses?.vulnerabilities?.length ||
    !!citizen.defenses?.damageImmunities?.length ||
    !!citizen.defenses?.conditionImmunities?.length;
  const hasSenses =
    citizen.senses?.passivePerception !== undefined ||
    citizen.senses?.darkvision !== undefined;

  const cantripLevel = citizen.playerSpellcasting?.spellLevels?.find(
    (sl) => sl.level === 0
  );
  const hasCantrips = !!cantripLevel?.spells?.length;
  const hasSpellSlots = !!citizen.playerSpellcasting?.spellLevels?.some(
    (sl) => sl.slotsTotal > 0
  );

  const formatEquipmentSlot = (slot?: string | { name?: string }) =>
    typeof slot === 'string' ? slot : slot?.name;

  return {
    hasPlayerStats,
    hasProficiencies,
    hasSavingThrows,
    hasSkills,
    hasAbilities,
    hasProfessions,
    hasEquipment,
    hasSpellcasting,
    hasDefenses,
    hasSenses,
    cantripLevel,
    hasCantrips,
    hasSpellSlots,
    formatEquipmentSlot,
  };
};
