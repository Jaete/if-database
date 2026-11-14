'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import LevelUpButton from '../LevelUpButton';
import { useCreation } from '../CreationContext';
import CreationViewHandles from '../CreationView/handles';
import '@/styles/components/creation.scss';

/**
 * A faixa da ficha enviada e ainda não aprovada: todos veem a ficha, sob
 * "Rascunho · aguardando aprovação". A dona vê o caminho para continuar (ou o
 * aviso com as observações da staff, quando devolvida); a staff, a revisão.
 */
const CreationBar = () => {
  const handles = useCssHandles(CreationViewHandles);
  const creation = useCreation();
  const { status, data } = creation;
  if (creation.adjusting) {
    return (
      <div className={handles.crBar} role="status">
        <span className={handles.crBarText}>
          <b>Ajustes do narrador · ao salvar, a ficha é aprovada</b>
          <small>
            Edite o que quiser e use &ldquo;Salvar e aprovar&rdquo;.
          </small>
        </span>
        <span className={handles.crBarActs}>
          <LevelUpButton variant="secondary" onClick={creation.cancelAdjust}>
            Cancelar
          </LevelUpButton>
        </span>
      </div>
    );
  }
  if (status !== 'submitted' && status !== 'returned') return null;

  const returned = status === 'returned';
  const last = [...(data?.review ?? [])]
    .reverse()
    .find((r) => r.kind === 'return');

  return (
    <div
      className={handles.crBar}
      data-tone={returned ? 'returned' : undefined}
      role="status"
    >
      <span className={handles.crBarText}>
        <b>
          {returned
            ? 'Rascunho · devolvida com observações'
            : 'Rascunho · aguardando aprovação'}
        </b>
        {returned && last?.notes && creation.canEdit && (
          <small>{last.notes}</small>
        )}
      </span>
      <span className={handles.crBarActs}>
        {creation.canEdit && (
          <LevelUpButton
            variant={returned ? 'primary' : 'secondary'}
            onClick={() => creation.openWizard('revisao')}
          >
            {returned ? 'Corrigir agora' : 'Continuar editando'}
          </LevelUpButton>
        )}
        {creation.isStaff && (
          <LevelUpButton variant="secondary" onClick={creation.openReview}>
            Revisar
          </LevelUpButton>
        )}
      </span>
    </div>
  );
};

export default CreationBar;
