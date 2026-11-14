'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { CheckIcon, ClassSigilIcon } from '../../Icons';
import CopyFichaTag from '../../CopyFichaTag';
import LevelUpButton from '../LevelUpButton';
import { useCreation } from '../CreationContext';
import CreationViewHandles from '../CreationView/handles';
import '@/styles/components/creation.scss';

const STEPS = [
  ['identidade', 'Identidade'],
  ['raca', 'Raça'],
  ['classe', 'Classe'],
  ['atributos', 'Atributos'],
  ['nivel1', 'Nível 1'],
  ['pericias', 'Perícias'],
  ['magias', 'Magias'],
  ['equipamento', 'Equipamento'],
  ['historia', 'História'],
] as const;

/**
 * A moldura da ficha em criação (blank e draft). Nada vaza: a página só enviou
 * o dono e o estado. Visitante vê "Ficha em criação"; a dona vê o convite (ou
 * "Continuar") e a trilha dos passos; a staff vê o andamento e a etiqueta.
 */
const CreationFrame = () => {
  const handles = useCssHandles(CreationViewHandles);
  const creation = useCreation();
  const { status, data, player, loaded } = creation;
  const owner = player?.ownerUsername ?? data?.player?.ownerUsername;
  const staff = creation.isStaff;
  const mine = creation.isOwner && creation.canEdit;
  const blank = status === 'blank';
  // Um passo só conta como feito com algo nele: sem classe, os passos que
  // dependem dela ainda não começaram, e os recomendados contam pela ausência
  // do aviso.
  const issues = data?.issues ?? [];
  const hasClass = !!data?.context.klass;
  const isDone = (step: string) =>
    ['nivel1', 'pericias', 'magias'].includes(step) && !hasClass
      ? false
      : step === 'equipamento' || step === 'historia'
        ? !issues.some((i) => i.step === step && i.kind === 'recommended')
        : !issues.some((i) => i.step === step && i.kind === 'required');

  return (
    <div className={handles.crFrame}>
      <div className={handles.crFrameCard}>
        <ClassSigilIcon width={56} height={56} aria-hidden="true" />
        <h2>Ficha em criação</h2>
        {loaded && mine ? (
          <>
            <p>
              {blank
                ? 'Esta ficha é sua. Comece quando quiser: tudo é salvo sozinho.'
                : 'Continue de onde parou. Tudo o que você fez está salvo.'}
            </p>
            <LevelUpButton
              variant="primary"
              size="lg"
              onClick={() =>
                blank ? creation.openRite() : creation.openWizard()
              }
            >
              {blank ? 'Começar minha ficha' : 'Continuar minha ficha'}
            </LevelUpButton>
          </>
        ) : loaded && staff ? (
          <p>
            {owner
              ? `${owner} está preenchendo esta ficha.`
              : 'Ficha em branco.'}{' '}
            Ela só aparece para os outros depois do envio.
          </p>
        ) : (
          <p>
            {owner
              ? `${owner} está escrevendo esta ficha.`
              : 'Esta ficha ainda está sendo escrita.'}{' '}
            Ela aparece aqui depois do envio.
          </p>
        )}
        {(mine || staff) && data && (
          <ol className={handles.crTrail} aria-label="Passos">
            {STEPS.map(([id, label]) => (
              <li
                key={id}
                className={handles.crTrailStep}
                data-done={isDone(id) || undefined}
              >
                {isDone(id) && <CheckIcon width={10} height={10} />}
                {label}
              </li>
            ))}
          </ol>
        )}
        {staff && player && (
          <div className={handles.crBarActs}>
            <CopyFichaTag playerId={String(player._id)} />
            <LevelUpButton variant="secondary" onClick={creation.openReview}>
              Ver o rascunho
            </LevelUpButton>
            {!mine && (
              <LevelUpButton
                variant="ghost"
                onClick={() => creation.openWizard()}
              >
                Preencher como staff
              </LevelUpButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreationFrame;
