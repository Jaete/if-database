'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { ATTRIBUTE_LABELS } from '@/lib/levelUp';
import { pickedSpells } from '../../catalogs';
import { useCatalogRequest } from '../../CatalogLayerContext';
import LevelUpButton from '../../LevelUpButton';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpViewHandles from '../../LevelUpView/handles';
import CreationViewHandles from '../handles';
import { useStep } from '../useStep';

/**
 * Magias: truques mais as preparadas, até o TOTAL de espaços (de qualquer
 * círculo). A escolha acontece no grimório, em modo escolha; o servidor confere
 * os limites.
 */
const SpellsStep = () => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const { creation, player, d } = useStep();
  const catalog = useCatalogRequest();
  const k = d.klass;

  if (!k || !k.caster) {
    return (
      <div className={`${lu.luContent} ${lu.luContent}--single`}>
        <div className={lu.luPane}>
          <div className={lu.luNote}>
            {k
              ? `${k.name} não conjura no nível 1: este passo não vale.`
              : 'Escolha a classe primeiro.'}
          </div>
        </div>
      </div>
    );
  }

  const refs = (
    (player.playerSpellcasting?.spellRefs ?? []) as { spellId: string }[]
  ).map((r) => String(r.spellId));
  const resolved = new Map(
    (player.playerSpellcasting?.spellLevels ?? []).flatMap((l) =>
      (l.spells ?? []).map(
        (s) =>
          [
            String((s as { spellId?: string }).spellId),
            { name: s.name, circle: l.level },
          ] as const
      )
    )
  );
  const rows = refs.map((id) => ({
    id,
    name: resolved.get(id)?.name ?? pickedSpells.get(id)?.name ?? '…',
    circle: resolved.get(id)?.circle ?? pickedSpells.get(id)?.circle ?? 1,
  }));
  const cantrips = rows.filter((r) => r.circle === 0);
  const prepared = rows.filter((r) => r.circle !== 0);
  const ability = k.spellcastingAbility;

  return (
    <div className={lu.luContent}>
      <div className={lu.luPane}>
        <div className={lu.luPaneHead}>
          <h3>Magias</h3>
          <p>
            Você conhece todas as magias da classe até o {k.maxCircle}º círculo.
            Prepara <b>{k.preparedLimit}</b> (a soma dos espaços) e conhece{' '}
            <b>{k.cantripsKnown}</b> truques.
            {ability && d.casting && (
              <>
                {' '}
                Conjuração com {ATTRIBUTE_LABELS[ability][1]}: CD{' '}
                <b>{d.casting.saveDC}</b>, ataque{' '}
                <b>+{d.casting.attackBonus}</b>.
              </>
            )}
          </p>
        </div>
        <div className={lu.luCounter}>
          <b>{cantrips.length}</b> de {k.cantripsKnown} truques ·{' '}
          <b>{prepared.length}</b> de {k.preparedLimit} preparadas
        </div>
        <div>
          <LevelUpButton
            variant="primary"
            size="lg"
            disabled={!creation.canEdit}
            onClick={() => {
              sheetSounds.play('paperSlide');
              catalog.open({ kind: 'spells' });
            }}
          >
            Abrir o grimório
          </LevelUpButton>
        </div>
        {rows.length === 0 ? (
          <div className={handles.crEmpty}>Nenhuma magia escolhida ainda.</div>
        ) : (
          <ul className={handles.crSpellList}>
            {rows.map((r) => (
              <li key={r.id} className={handles.crSpellItem}>
                <span>{r.name}</span>
                <small>
                  {r.circle === 0 ? 'truque' : `${r.circle}º círculo`}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
      <LevelUpDetail
        kind="Conjuração"
        title={k.name}
        body={`Espaços no nível 1: ${k.slots.map((n, i) => `${i + 1}º círculo: ${n}`).join(' · ') || 'nenhum'}.\nA CD e o ataque saem da classe, e não do texto de cada magia.`}
      />
    </div>
  );
};

export default SpellsStep;
