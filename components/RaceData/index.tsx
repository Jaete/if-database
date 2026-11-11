'use client';

import { useState } from 'react';
import { useOptionalAuth } from '@/app/context/AuthContext';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { plural } from '@/lib/plural';
import { PencilIcon } from '../Icons';
import ConfirmModal from '../ConfirmModal';
import RaceArt from '../RaceArt';
import RaceGhostAdd from '../RaceGhostAdd';
import RaceIconButton from '../RaceIconButton';
import Abilities from './Abilities';
import AdminStrip from './AdminStrip';
import ChoiceRules from './ChoiceRules';
import EditorHost from './EditorHost';
import Hero from './Hero';
import Lineage from './Lineage';
import Lore from './Lore';
import Sheet from './Sheet';
import TopBar from './TopBar';
import type { IRaceView } from './types';
import { useRaceData } from './useRaceData';
import { useRaceEditor } from './useRaceEditor';
import RaceDataHandles from './handles';
import '@/styles/components/raceData.scss';

interface IProps {
  race: IRaceView;
  /** Sub-raça aberta ao entrar (`?sub=`). */
  initialSub?: string;
  /** Esconde toda a edição, mesmo para quem pode editar. */
  readOnly?: boolean;
  /** Rota da listagem: `/races` no site, `/embed/races` no iframe do fórum. */
  basePath?: string;
}

/**
 * O detalhe de uma raça: topo, ficha de traços, habilidades, crônica e
 * sub-raças. Quem pode editar corrige cada seção no lápis dela.
 */
const RaceData = ({
  race: initial,
  initialSub,
  readOnly = false,
  basePath = '/races',
}: IProps) => {
  const handles = useCssHandles(RaceDataHandles);
  const auth = useOptionalAuth();
  const canEdit = !readOnly && (auth?.canEdit ?? false);
  const data = useRaceData(initial, initialSub);
  const { race, sub } = data;

  const { editing, close, removing, setRemoving, actions } = useRaceEditor(
    data,
    canEdit
  );
  const [imageIndex, setImageIndex] = useState(0);

  const mixed = (race.choiceRules?.length ?? 0) > 0;
  const hasSubs = race.subraces.length > 0;
  const abilityCount = race.traits.length + (race.baseOnlyTraits?.length ?? 0);
  const current = race.images[Math.min(imageIndex, race.images.length - 1)];

  const sections = [
    { id: 'tracos', label: 'Traços' },
    { id: 'habilidades', label: mixed ? 'Regras' : 'Habilidades' },
    { id: 'cronica', label: 'Crônica' },
    ...(hasSubs || canEdit ? [{ id: 'sub-racas', label: 'Sub-raças' }] : []),
  ];

  return (
    <div className={handles.raceDetail}>
      <TopBar sections={sections} basePath={basePath} />
      {canEdit && (
        <AdminStrip
          sourceUrl={race.sourceUrl}
          onReimport={actions.reimport}
          onDelete={actions.deleteRace}
        />
      )}

      <Hero
        race={race}
        imageIndex={imageIndex}
        onPickImage={setImageIndex}
        actions={actions}
      />

      <div className={handles.raceStage}>
        {current && (
          <div className={handles.raceAmbient} aria-hidden="true">
            <RaceArt key={current.url} image={current} label={race.name} />
          </div>
        )}
        <div className={handles.raceBody}>
          <Sheet race={race} canEdit={canEdit} onEdit={actions.editTraits} />

          <div className={handles.raceMain}>
            {canEdit && data.warnings.length > 0 && (
              <div className={handles.raceWarn} role="note">
                <span>Avisos da importação · só admin vê</span>
                {data.warnings.map((w) => (
                  <p key={w}>{w}</p>
                ))}
                <p>
                  O parser leu algo que não soube encaixar. Confira no tópico e
                  corrija na seção certa.
                </p>
              </div>
            )}

            <section id="habilidades" aria-labelledby="race-h-hab">
              {mixed ? (
                <>
                  <div className={handles.raceSecHead}>
                    <h2 id="race-h-hab">Regras de escolha</h2>
                    <small>esta raça não tem habilidades próprias</small>
                  </div>
                  <ChoiceRules
                    rules={race.choiceRules ?? []}
                    actions={actions}
                  />
                </>
              ) : (
                <>
                  <div className={handles.raceSecHead}>
                    <h2 id="race-h-hab">Habilidades raciais</h2>
                    <small>
                      {plural(abilityCount, 'habilidade', 'habilidades')}
                    </small>
                  </div>
                  {((race.notes?.length ?? 0) > 0 || canEdit) && (
                    <div className={handles.raceNotes}>
                      {(race.notes ?? []).map((n) => (
                        <p key={n}>{n}</p>
                      ))}
                      {canEdit && (
                        <span className={handles.raceNotesEdit}>
                          {race.notes?.length ? (
                            <RaceIconButton
                              small
                              label="Editar notas de introdução"
                              icon={<PencilIcon />}
                              onClick={actions.editNotes}
                            />
                          ) : (
                            <RaceGhostAdd
                              label="Nota de introdução"
                              onClick={actions.editNotes}
                            />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                  {hasSubs && (
                    <div className={handles.raceTier}>
                      Comum a todas as sub-raças · soma-se às da sub-raça
                      escolhida
                    </div>
                  )}
                  <Abilities
                    traits={race.traits}
                    scope="race"
                    actions={actions}
                  />
                  {((race.baseOnlyTraits?.length ?? 0) > 0 ||
                    (canEdit && hasSubs)) && (
                    <div
                      className={handles.raceBaseOnly}
                      role="group"
                      aria-labelledby="race-h-base"
                    >
                      <header className={handles.raceBaseOnlyHead}>
                        <div>
                          <h3 id="race-h-base">Só da raça base</h3>
                          <span className={handles.racePillBase}>
                            Sem sub-raça
                          </span>
                        </div>
                        <p>
                          Valem apenas para quem é {race.name} sem escolher
                          sub-raça. Quem escolhe uma sub-raça não recebe estas;
                          recebe as comuns acima somadas às da sub-raça.
                        </p>
                      </header>
                      <Abilities
                        traits={race.baseOnlyTraits ?? []}
                        scope="base"
                        actions={actions}
                      />
                    </div>
                  )}
                </>
              )}
            </section>

            <section id="cronica" aria-labelledby="race-h-cron">
              <div className={handles.raceSecHead}>
                <h2 id="race-h-cron">Crônica</h2>
                {canEdit && (
                  <RaceIconButton
                    small
                    label="Editar crônica"
                    icon={<PencilIcon />}
                    onClick={actions.editLore}
                  />
                )}
              </div>
              <Lore race={race} />
            </section>
          </div>
        </div>
      </div>

      {(hasSubs || canEdit) && (
        <Lineage
          race={race}
          selectedSlug={sub?.slug}
          onSelect={data.selectSub}
          actions={actions}
        />
      )}

      <EditorHost
        editing={editing}
        data={data}
        actions={actions}
        onClose={close}
        onAskRemoval={setRemoving}
        onImagesSaved={() => setImageIndex(0)}
      />

      <ConfirmModal
        isOpen={removing !== null}
        onClose={() => setRemoving(null)}
        onConfirm={() => removing?.confirm()}
        title={removing?.title ?? ''}
        message={removing?.message}
        confirmLabel={removing?.confirmLabel}
      />

      {(data.notice || (data.error && !editing)) && (
        <div
          className={`${handles.raceToast}${
            data.error && !editing
              ? ` ${applyModifiers(handles.raceToast, 'error')}`
              : ''
          }`}
          role="status"
        >
          {data.error && !editing ? data.error : data.notice}
        </div>
      )}
    </div>
  );
};

export default RaceData;
