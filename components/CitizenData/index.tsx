'use client';

import type ICitizen from '@/db/citizens/citizen.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import { formatModifier, statModifier } from '@/lib/stats';
import { useCitizenData } from './useCitizenData';

import EntityTitle from '@/components/EntityTitle';
import EntityImage from '@/components/EntityImage';
import EntityDescription from '@/components/EntityDescription';
import StatSection from '@/components/StatSection';
import InfoRow from '@/components/InfoRow';
import AttributesGrid from '@/components/AttributesGrid';
import AbilityCard from '@/components/AbilityCard';
import StatTable from '@/components/StatTable';
import SensesBlock from '@/components/SensesBlock';
import CitizenDataHandles from './handles';
import '@/styles/components/citizenData.scss';

interface IProps {
  citizen: ICitizen;
}

const ATTRIBUTES = [
  ['str', 'FOR'],
  ['dex', 'DES'],
  ['con', 'CON'],
  ['int', 'INT'],
  ['wis', 'SAB'],
  ['cha', 'CAR'],
] as const;

const EQUIPMENT_SLOTS = [
  ['head', 'Cabeça'],
  ['torso', 'Tronco'],
  ['legs', 'Pernas'],
  ['feet', 'Pés'],
  ['hand', 'Mão'],
  ['offhand', 'Secundária'],
  ['accessory1', 'Acessório 1'],
  ['accessory2', 'Acessório 2'],
] as const;

const IDENTITY_FIELDS = [
  ['race', 'Raça'],
  ['class', 'Classe'],
  ['level', 'Nível'],
  ['age', 'Idade'],
  ['height', 'Altura'],
  ['deity', 'Adoração'],
  ['family', 'Família'],
  ['kingdom', 'Reino'],
  ['clan', 'Clã'],
  ['alignment', 'Alinhamento'],
] as const;

const CitizenData = ({ citizen }: IProps) => {
  const handles = useCssHandles(CitizenDataHandles);
  const {
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
  } = useCitizenData(citizen);

  return (
    <div key={citizen.slug} className={handles.citizenData}>
      <EntityTitle>{citizen.name}</EntityTitle>

      {citizen.image && <EntityImage src={citizen.image} alt={citizen.name} />}

      {/* Identity Info */}
      <div className={handles.citizenInfoList}>
        {IDENTITY_FIELDS.map(([field, label]) => {
          const value = citizen[field];
          if (value === undefined || value === null || value === '')
            return null;
          return (
            <InfoRow key={field} label={`${label}: `}>
              {value}
            </InfoRow>
          );
        })}
      </div>

      {/* Description */}
      {citizen.description && (
        <EntityDescription>{citizen.description}</EntityDescription>
      )}

      {/* Combat Resources */}
      <StatSection title="Informações de Combate">
        <InfoRow label="Classe de Armadura:">
          {typeof citizen.combat?.ac === 'object' &&
          citizen.combat?.ac?.value !== undefined
            ? citizen.combat.ac.value
            : typeof citizen.combat?.ac === 'string'
              ? citizen.combat.ac
              : '---'}
        </InfoRow>
        <InfoRow label="Pontos de Vida:">
          {typeof citizen.combat?.hp === 'object' &&
          citizen.combat?.hp?.value !== undefined
            ? citizen.combat.hp.value
            : typeof citizen.combat?.hp === 'string'
              ? citizen.combat.hp
              : '---'}
        </InfoRow>
        <InfoRow label="Deslocamento:">
          {typeof citizen.combat?.speed === 'object' &&
          citizen.combat?.speed?.walk !== undefined
            ? `${citizen.combat.speed.walk} m`
            : typeof citizen.combat?.speed === 'string'
              ? citizen.combat.speed
              : '---'}
        </InfoRow>
        {citizen.chi && (
          <InfoRow label="Chi:">
            {citizen.chi.current} / {citizen.chi.max}
          </InfoRow>
        )}
        {citizen.proficiencyBonus !== undefined && (
          <InfoRow label="Bônus de Proficiência:">
            +{citizen.proficiencyBonus}
          </InfoRow>
        )}
      </StatSection>

      {/* Stats with Breakdown */}
      {hasPlayerStats && citizen.playerStats && (
        <StatSection title="Atributos">
          <AttributesGrid
            items={ATTRIBUTES.flatMap(([key, label]) => {
              const stat =
                citizen.playerStats![key as keyof typeof citizen.playerStats];
              if (!stat) return [];
              return [
                {
                  key,
                  label,
                  value: formatModifier(stat.modifier),
                  sub: stat.total,
                },
              ];
            })}
          />
        </StatSection>
      )}

      {/* Simple Stats (fallback) */}
      {!hasPlayerStats &&
        (citizen.stats?.str !== undefined ||
          citizen.stats?.dex !== undefined) && (
          <StatSection title="Atributos">
            <AttributesGrid
              items={ATTRIBUTES.flatMap(([key, label]) => {
                const val = citizen.stats![key as keyof typeof citizen.stats];
                if (val === undefined) return [];
                return [
                  {
                    key,
                    label,
                    value: statModifier(val),
                    sub: val,
                  },
                ];
              })}
            />
          </StatSection>
        )}

      {/* Proficiencies */}
      {(hasProficiencies || hasSavingThrows || hasSkills) && (
        <StatSection title="Proficiências">
          {citizen.proficiencies?.weapons &&
            citizen.proficiencies.weapons.length > 0 && (
              <InfoRow label="Armas: ">
                {citizen.proficiencies.weapons.join(', ')}
              </InfoRow>
            )}
          {citizen.proficiencies?.armor &&
            citizen.proficiencies.armor.length > 0 && (
              <InfoRow label="Armaduras: ">
                {citizen.proficiencies.armor.join(', ')}
              </InfoRow>
            )}
          {citizen.proficiencies?.tools &&
            citizen.proficiencies.tools.length > 0 && (
              <InfoRow label="Ferramentas: ">
                {citizen.proficiencies.tools.join(', ')}
              </InfoRow>
            )}
          {citizen.proficiencies?.savingThrows &&
            citizen.proficiencies.savingThrows.length > 0 && (
              <InfoRow label="Testes de Resistência: ">
                {citizen.proficiencies.savingThrows
                  .map((st) => `${st.attribute} ${st.value}`)
                  .join(', ')}
              </InfoRow>
            )}
          {citizen.proficiencies?.skills &&
            citizen.proficiencies.skills.length > 0 && (
              <InfoRow label="Perícias: ">
                {citizen.proficiencies.skills
                  .map((sk) => sk.name)
                  .filter(Boolean)
                  .join(', ')}
              </InfoRow>
            )}
        </StatSection>
      )}

      {/* Abilities */}
      {hasAbilities && (
        <StatSection title="Habilidades e Características">
          <div className={handles.citizenAbilities}>
            {citizen.abilities!.map((ability, i) => (
              <AbilityCard key={i} name={ability.name}>
                {ability.description}
              </AbilityCard>
            ))}
          </div>
        </StatSection>
      )}

      {/* Professions */}
      {hasProfessions && (
        <StatSection title="Profissões">
          <div className={handles.citizenAbilities}>
            {citizen.professions!.map((prof, i) => (
              <AbilityCard key={i} name={prof.name}>
                {prof.subProfessions && prof.subProfessions.length > 0
                  ? `Sub-profissões: ${prof.subProfessions
                      .map((sp) => sp.name)
                      .join(', ')}`
                  : undefined}
              </AbilityCard>
            ))}
          </div>
        </StatSection>
      )}

      {/* Spellcasting */}
      {hasSpellcasting && citizen.playerSpellcasting && (
        <StatSection title="Conjuração">
          <InfoRow label="Habilidade de Conjuração: ">
            {citizen.playerSpellcasting.ability}
          </InfoRow>
          <InfoRow label="CD Salvamento: ">
            {citizen.playerSpellcasting.saveDC}
          </InfoRow>
          <InfoRow label="Bônus de Ataque: ">
            +{citizen.playerSpellcasting.attackBonus}
          </InfoRow>

          {/* Cantrips (Truques) */}
          {hasCantrips && cantripLevel && (
            <div className={handles.citizenCantrips}>
              <InfoRow label="Truques: ">
                {cantripLevel
                  .spells!.map((s) => s.name)
                  .filter(Boolean)
                  .join(', ')}
              </InfoRow>
            </div>
          )}

          {/* Spell Slots Table */}
          {hasSpellSlots && (
            <StatTable
              columns={['Círculo', 'Slots']}
              rows={citizen.playerSpellcasting.spellLevels!.flatMap((sl) =>
                sl.slotsTotal > 0
                  ? [
                      {
                        key: String(sl.level),
                        cells: [
                          `${sl.level}º`,
                          `${sl.slotsUsed} / ${sl.slotsTotal}`,
                        ] as [React.ReactNode, React.ReactNode],
                      },
                    ]
                  : []
              )}
            />
          )}
        </StatSection>
      )}

      {/* Equipment */}
      {hasEquipment && (
        <StatSection title="Equipamento">
          {EQUIPMENT_SLOTS.map(([slot, label]) => {
            const value = citizen.equipment?.[slot];
            if (!value) return null;
            return (
              <InfoRow key={slot} label={`${label}: `}>
                {formatEquipmentSlot(value)}
              </InfoRow>
            );
          })}
          {citizen.equipment?.gil !== undefined && (
            <InfoRow label="Gil: ">
              {citizen.equipment.gil.toLocaleString()}
            </InfoRow>
          )}
          {citizen.equipment?.backpack && (
            <InfoRow label="Mochila: " pre>
              {citizen.equipment.backpack}
            </InfoRow>
          )}
        </StatSection>
      )}

      {/* Appearance */}
      {citizen.appearance && (
        <StatSection title="Aparência">
          <EntityDescription>{citizen.appearance}</EntityDescription>
        </StatSection>
      )}

      {/* Backstory */}
      {citizen.backstory && (
        <StatSection title="História">
          <EntityDescription>{citizen.backstory}</EntityDescription>
        </StatSection>
      )}

      {/* Defenses */}
      {hasDefenses && (
        <StatSection title="Defesas">
          {citizen.defenses?.vulnerabilities &&
            citizen.defenses.vulnerabilities.length > 0 && (
              <InfoRow label="Vulnerabilidades: ">
                {citizen.defenses.vulnerabilities.join(', ')}
              </InfoRow>
            )}
          {citizen.defenses?.resistances &&
            citizen.defenses.resistances.length > 0 && (
              <InfoRow label="Resistências: ">
                {citizen.defenses.resistances.join(', ')}
              </InfoRow>
            )}
          {citizen.defenses?.damageImmunities &&
            citizen.defenses.damageImmunities.length > 0 && (
              <InfoRow label="Imunidades a Dano: ">
                {citizen.defenses.damageImmunities.join(', ')}
              </InfoRow>
            )}
          {citizen.defenses?.conditionImmunities &&
            citizen.defenses.conditionImmunities.length > 0 && (
              <InfoRow label="Imunidades a Condições: ">
                {citizen.defenses.conditionImmunities.join(', ')}
              </InfoRow>
            )}
        </StatSection>
      )}

      {/* Senses */}
      {hasSenses && <SensesBlock senses={citizen.senses ?? {}} />}

      {/* Languages */}
      {citizen.languages && citizen.languages.length > 0 && (
        <StatSection title="Idiomas">
          <InfoRow label="">{citizen.languages.join(', ')}</InfoRow>
        </StatSection>
      )}
    </div>
  );
};

export default CitizenData;
