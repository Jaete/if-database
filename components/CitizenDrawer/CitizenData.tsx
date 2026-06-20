import type ICitizen from '@/db/citizens/citizen.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import CitizenDataHandles from './handles';

interface IProps {
  citizen: ICitizen;
}

const CitizenData = ({ citizen }: IProps) => {
  const handles = useCssHandles(CitizenDataHandles);

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

  const statModifier = (val?: number) => {
    if (val === undefined) return '-';
    const mod = Math.floor((val - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <div key={citizen.slug} className={`${handles.creatureData} citizenData`}>
      {/* Header */}
      <div className={handles.creatureHeader}>
        <h2 className={handles.creatureName}>{citizen.name}</h2>
      </div>

      {/* Image */}
      {citizen.image && (
        <div className={handles.creatureImageContainer}>
          <div className={handles.creatureImageLoader} />
          <img
            src={citizen.image}
            alt={citizen.name}
            onLoad={(e) => e.currentTarget.classList.add('loaded')}
            className={handles.creatureImage}
          />
        </div>
      )}

      {/* Identity Info */}
      <div className={handles.creatureInfoList}>
        {citizen.race && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Raça: </span>
            <span className={handles.infoValue}>{citizen.race}</span>
          </div>
        )}
        {citizen.class && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Classe: </span>
            <span className={handles.infoValue}>{citizen.class}</span>
          </div>
        )}
        {citizen.level !== undefined && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Nível: </span>
            <span className={handles.infoValue}>{citizen.level}</span>
          </div>
        )}
        {citizen.age && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Idade: </span>
            <span className={handles.infoValue}>{citizen.age}</span>
          </div>
        )}
        {citizen.height && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Altura: </span>
            <span className={handles.infoValue}>{citizen.height}</span>
          </div>
        )}
        {citizen.deity && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Adoração: </span>
            <span className={handles.infoValue}>{citizen.deity}</span>
          </div>
        )}
        {citizen.family && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Família: </span>
            <span className={handles.infoValue}>{citizen.family}</span>
          </div>
        )}
        {citizen.kingdom && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Reino: </span>
            <span className={handles.infoValue}>{citizen.kingdom}</span>
          </div>
        )}
        {citizen.clan && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Clã: </span>
            <span className={handles.infoValue}>{citizen.clan}</span>
          </div>
        )}
        {citizen.alignment && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Alinhamento: </span>
            <span className={handles.infoValue}>{citizen.alignment}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {citizen.description && (
        <p className={handles.creatureDescription}>{citizen.description}</p>
      )}

      {/* Combat Resources */}
      <div className={handles.statSection}>
        <h3>Recursos</h3>
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>HP: </span>
          <span className={handles.infoValue}>
            {typeof citizen.combat?.hp === 'object' &&
            citizen.combat?.hp?.value !== undefined
              ? citizen.combat.hp.value
              : typeof citizen.combat?.hp === 'string'
                ? citizen.combat.hp
                : '--'}
          </span>
        </div>
        {citizen.chi && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Chi: </span>
            <span className={handles.infoValue}>
              {citizen.chi.current} / {citizen.chi.max}
            </span>
          </div>
        )}
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>CA: </span>
          <span className={handles.infoValue}>
            {typeof citizen.combat?.ac === 'object' &&
            citizen.combat?.ac?.value !== undefined
              ? citizen.combat.ac.value
              : typeof citizen.combat?.ac === 'string'
                ? citizen.combat.ac
                : '--'}
          </span>
        </div>
        {citizen.proficiencyBonus !== undefined && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Bônus de Proficiência: </span>
            <span className={handles.infoValue}>
              +{citizen.proficiencyBonus}
            </span>
          </div>
        )}
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>Velocidade: </span>
          <span className={handles.infoValue}>
            {typeof citizen.combat?.speed === 'object' &&
            citizen.combat?.speed?.walk !== undefined
              ? `${citizen.combat.speed.walk}m`
              : typeof citizen.combat?.speed === 'string'
                ? citizen.combat.speed
                : '--'}
          </span>
        </div>
      </div>

      {/* Stats with Breakdown */}
      {hasPlayerStats && citizen.playerStats && (
        <div className={handles.statSection}>
          <h3>Atributos</h3>
          <div className={handles.attributesGrid}>
            {(
              [
                ['str', 'FOR'],
                ['dex', 'DES'],
                ['con', 'CON'],
                ['int', 'INT'],
                ['wis', 'SAB'],
                ['cha', 'CAR'],
              ] as const
            ).map(([key, label]) => {
              const stat =
                citizen.playerStats![key as keyof typeof citizen.playerStats];
              if (!stat) return null;
              return (
                <div key={key} className={handles.attrItem}>
                  <span className={handles.attrLabel}>{label}</span>
                  <span className={handles.attrValue}>
                    {stat.total}
                    <br />
                    <small style={{ fontSize: '11px', color: '#808080' }}>
                      Base {stat.base}
                      {stat.raceBonus
                        ? ` +R${stat.raceBonus >= 0 ? stat.raceBonus : stat.raceBonus}`
                        : ''}
                      {stat.classBonus
                        ? ` +C${stat.classBonus >= 0 ? stat.classBonus : stat.classBonus}`
                        : ''}
                      {' · '}
                      {stat.modifier >= 0 ? `+${stat.modifier}` : stat.modifier}
                    </small>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Simple Stats (fallback) */}
      {!hasPlayerStats &&
        (citizen.stats?.str !== undefined ||
          citizen.stats?.dex !== undefined) && (
          <div className={handles.statSection}>
            <h3>Atributos</h3>
            <div className={handles.attributesGrid}>
              {(
                [
                  ['str', 'FOR'],
                  ['dex', 'DES'],
                  ['con', 'CON'],
                  ['int', 'INT'],
                  ['wis', 'SAB'],
                  ['cha', 'CAR'],
                ] as const
              ).map(([key, label]) => {
                const val = citizen.stats![key as keyof typeof citizen.stats];
                if (val === undefined) return null;
                return (
                  <div key={key} className={handles.attrItem}>
                    <span className={handles.attrLabel}>{label}</span>
                    <span className={handles.attrValue}>
                      {val}
                      <br />
                      <small style={{ fontSize: '11px', color: '#808080' }}>
                        {statModifier(val)}
                      </small>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Proficiencies */}
      {(hasProficiencies || hasSavingThrows || hasSkills) && (
        <div className={handles.statSection}>
          <h3>Proficiências</h3>
          {citizen.proficiencies?.weapons &&
            citizen.proficiencies.weapons.length > 0 && (
              <div className={handles.infoRow}>
                <span className={handles.infoLabel}>Armas: </span>
                <span className={handles.infoValue}>
                  {citizen.proficiencies.weapons.join(', ')}
                </span>
              </div>
            )}
          {citizen.proficiencies?.armor &&
            citizen.proficiencies.armor.length > 0 && (
              <div className={handles.infoRow}>
                <span className={handles.infoLabel}>Armaduras: </span>
                <span className={handles.infoValue}>
                  {citizen.proficiencies.armor.join(', ')}
                </span>
              </div>
            )}
          {citizen.proficiencies?.tools &&
            citizen.proficiencies.tools.length > 0 && (
              <div className={handles.infoRow}>
                <span className={handles.infoLabel}>Ferramentas: </span>
                <span className={handles.infoValue}>
                  {citizen.proficiencies.tools.join(', ')}
                </span>
              </div>
            )}
          {citizen.proficiencies?.savingThrows &&
            citizen.proficiencies.savingThrows.length > 0 && (
              <div className={handles.infoRow}>
                <span className={handles.infoLabel}>
                  Testes de Resistência:{' '}
                </span>
                <span className={handles.infoValue}>
                  {citizen.proficiencies.savingThrows
                    .map((st) => `${st.attribute} ${st.value}`)
                    .join(', ')}
                </span>
              </div>
            )}
          {citizen.proficiencies?.skills &&
            citizen.proficiencies.skills.length > 0 && (
              <div className={handles.infoRow}>
                <span className={handles.infoLabel}>Perícias: </span>
                <span className={handles.infoValue}>
                  {citizen.proficiencies.skills
                    .map((sk) => sk.name)
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            )}
        </div>
      )}

      {/* Abilities */}
      {hasAbilities && (
        <div className={handles.statSection}>
          <h3>Habilidades e Características</h3>
          <div className={handles.abilitiesContainer}>
            {citizen.abilities!.map((ability, i) => (
              <div key={i} className={handles.ability}>
                {ability.name && (
                  <strong className={handles.abilityName}>
                    {ability.name}
                  </strong>
                )}
                {ability.description && (
                  <p className={handles.abilityDescription}>
                    {ability.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professions */}
      {hasProfessions && (
        <div className={handles.statSection}>
          <h3>Profissões</h3>
          <div className={handles.abilitiesContainer}>
            {citizen.professions!.map((prof, i) => (
              <div key={i} className={handles.ability}>
                <strong className={handles.abilityName}>{prof.name}</strong>
                {prof.subProfessions && prof.subProfessions.length > 0 && (
                  <p className={handles.abilityDescription}>
                    Sub-profissões:{' '}
                    {prof.subProfessions.map((sp) => sp.name).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spellcasting */}
      {hasSpellcasting && citizen.playerSpellcasting && (
        <div className={handles.statSection}>
          <h3>Conjuração</h3>
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>
              Habilidade de Conjuração:{' '}
            </span>
            <span className={handles.infoValue}>
              {citizen.playerSpellcasting.ability}
            </span>
          </div>
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>CD Salvamento: </span>
            <span className={handles.infoValue}>
              {citizen.playerSpellcasting.saveDC}
            </span>
          </div>
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Bônus de Ataque: </span>
            <span className={handles.infoValue}>
              +{citizen.playerSpellcasting.attackBonus}
            </span>
          </div>
          {citizen.playerSpellcasting.spellLevels &&
            citizen.playerSpellcasting.spellLevels.length > 0 && (
              <>
                {/* Cantrips (Truques) */}
                {(() => {
                  const cantripLevel =
                    citizen.playerSpellcasting!.spellLevels!.find(
                      (sl) => sl.level === 0
                    );
                  if (!cantripLevel?.spells || cantripLevel.spells.length === 0)
                    return null;
                  return (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div className={handles.infoRow}>
                        <span className={handles.infoLabel}>Truques: </span>
                        <span className={handles.infoValue}>
                          {cantripLevel.spells
                            .map((s) => s.name)
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Spell Slots Table */}
                {citizen.playerSpellcasting.spellLevels.some(
                  (sl) => sl.slotsTotal > 0
                ) && (
                  <table className={handles.dropsTable}>
                    <thead>
                      <tr>
                        <td>
                          <strong>Círculo</strong>
                        </td>
                        <td>
                          <strong>Slots</strong>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {citizen.playerSpellcasting.spellLevels.map(
                        (sl) =>
                          sl.slotsTotal > 0 && (
                            <tr key={sl.level}>
                              <td className={handles.dropRange}>{sl.level}º</td>
                              <td className={handles.dropItem}>
                                {sl.slotsUsed} / {sl.slotsTotal}
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                )}
              </>
            )}
        </div>
      )}

      {/* Equipment */}
      {hasEquipment && (
        <div className={handles.statSection}>
          <h3>Equipamento</h3>
          {citizen.equipment?.head && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Cabeça: </span>
              <span className={handles.infoValue}>
                {typeof citizen.equipment.head === 'string'
                  ? citizen.equipment.head
                  : citizen.equipment.head.name}
              </span>
            </div>
          )}
          {citizen.equipment?.torso && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Tronco: </span>
              <span className={handles.infoValue}>
                {typeof citizen.equipment.torso === 'string'
                  ? citizen.equipment.torso
                  : citizen.equipment.torso.name}
              </span>
            </div>
          )}
          {citizen.equipment?.legs && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Pernas: </span>
              <span className={handles.infoValue}>
                {typeof citizen.equipment.legs === 'string'
                  ? citizen.equipment.legs
                  : citizen.equipment.legs.name}
              </span>
            </div>
          )}
          {citizen.equipment?.feet && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Pés: </span>
              <span className={handles.infoValue}>
                {typeof citizen.equipment.feet === 'string'
                  ? citizen.equipment.feet
                  : citizen.equipment.feet.name}
              </span>
            </div>
          )}
          {citizen.equipment?.hand && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Mão: </span>
              <span className={handles.infoValue}>
                {typeof citizen.equipment.hand === 'string'
                  ? citizen.equipment.hand
                  : citizen.equipment.hand.name}
              </span>
            </div>
          )}
          {citizen.equipment?.offhand && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Secundária: </span>
              <span className={handles.infoValue}>
                {typeof citizen.equipment.offhand === 'string'
                  ? citizen.equipment.offhand
                  : citizen.equipment.offhand.name}
              </span>
            </div>
          )}
          {citizen.equipment?.accessory1 && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Acessório 1: </span>
              <span className={handles.infoValue}>
                {typeof citizen.equipment.accessory1 === 'string'
                  ? citizen.equipment.accessory1
                  : citizen.equipment.accessory1.name}
              </span>
            </div>
          )}
          {citizen.equipment?.accessory2 && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Acessório 2: </span>
              <span className={handles.infoValue}>
                {typeof citizen.equipment.accessory2 === 'string'
                  ? citizen.equipment.accessory2
                  : citizen.equipment.accessory2.name}
              </span>
            </div>
          )}
          {citizen.equipment?.gil !== undefined && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Gil: </span>
              <span className={handles.infoValue}>
                {citizen.equipment.gil.toLocaleString()}
              </span>
            </div>
          )}
          {citizen.equipment?.backpack && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Mochila: </span>
              <span
                className={handles.infoValue}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {citizen.equipment.backpack}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Appearance */}
      {citizen.appearance && (
        <div className={handles.statSection}>
          <h3>Aparência</h3>
          <p className={handles.creatureDescription}>{citizen.appearance}</p>
        </div>
      )}

      {/* Backstory */}
      {citizen.backstory && (
        <div className={handles.statSection}>
          <h3>História</h3>
          <p className={handles.creatureDescription}>{citizen.backstory}</p>
        </div>
      )}

      {/* Defenses */}
      {hasDefenses && (
        <div className={handles.statSection}>
          <h3>Defesas</h3>
          {citizen.defenses?.vulnerabilities &&
            citizen.defenses.vulnerabilities.length > 0 && (
              <div className={handles.infoRow}>
                <span className={handles.infoLabel}>Vulnerabilidades: </span>
                <span className={handles.infoValue}>
                  {citizen.defenses.vulnerabilities.join(', ')}
                </span>
              </div>
            )}
          {citizen.defenses?.resistances &&
            citizen.defenses.resistances.length > 0 && (
              <div className={handles.infoRow}>
                <span className={handles.infoLabel}>Resistências: </span>
                <span className={handles.infoValue}>
                  {citizen.defenses.resistances.join(', ')}
                </span>
              </div>
            )}
          {citizen.defenses?.damageImmunities &&
            citizen.defenses.damageImmunities.length > 0 && (
              <div className={handles.infoRow}>
                <span className={handles.infoLabel}>Imunidades a Dano: </span>
                <span className={handles.infoValue}>
                  {citizen.defenses.damageImmunities.join(', ')}
                </span>
              </div>
            )}
          {citizen.defenses?.conditionImmunities &&
            citizen.defenses.conditionImmunities.length > 0 && (
              <div className={handles.infoRow}>
                <span className={handles.infoLabel}>
                  Imunidades a Condições:{' '}
                </span>
                <span className={handles.infoValue}>
                  {citizen.defenses.conditionImmunities.join(', ')}
                </span>
              </div>
            )}
        </div>
      )}

      {/* Senses */}
      {hasSenses && (
        <div className={handles.statSection}>
          <h3>Sentidos</h3>
          {citizen.senses?.passivePerception !== undefined && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Percepção Passiva: </span>
              <span className={handles.infoValue}>
                {citizen.senses.passivePerception}
              </span>
            </div>
          )}
          {citizen.senses?.darkvision !== undefined && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Visão no Escuro: </span>
              <span className={handles.infoValue}>
                {citizen.senses.darkvision}m
              </span>
            </div>
          )}
          {citizen.senses?.blindsight !== undefined && (
            <div className={handles.infoRow}>
              <span className={handles.infoLabel}>Visão Tendencial: </span>
              <span className={handles.infoValue}>
                {citizen.senses.blindsight}m
              </span>
            </div>
          )}
        </div>
      )}

      {/* Languages */}
      {citizen.languages && citizen.languages.length > 0 && (
        <div className={handles.statSection}>
          <h3>Idiomas</h3>
          <div className={handles.infoRow}>
            <span className={handles.infoValue}>
              {citizen.languages.join(', ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenData;
