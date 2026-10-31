'use client';

import type ICharacterClass from '@/db/classes/class.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import { PencilIcon } from '../../Icons';
import ClassDataHandles from '../handles';
import SheetHandles from './handles';

interface IProps {
  characterClass: ICharacterClass;
  /** Presente só para quem edita: abre o modal de edição da classe. */
  onEdit?: () => void;
}

/** A ficha lateral: proficiências, equipamento inicial, variantes e fonte. */
const Sheet = ({ characterClass: k, onEdit }: IProps) => {
  const handles = useCssHandles(SheetHandles);
  const shared = useCssHandles(ClassDataHandles);

  const p = k.proficiencies;
  const rows = (
    [
      ['Armaduras', p?.armor],
      ['Armas', p?.weapons],
      ['Ferramentas', p?.tools],
      ['Testes de resistência', p?.savingThrows],
      ['Perícias', p?.skills],
    ] as const
  ).filter(([, value]) => !!value);

  // O bloco cru só aparece quando a estruturação não achou nada: quando
  // achou, repeti-lo seria mostrar a mesma coisa duas vezes.
  const raw = rows.length === 0 ? p?.raw : undefined;

  const importedAt = k.importedAt
    ? new Date(k.importedAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    : null;

  return (
    <aside className={handles.clsSheet} aria-label="Ficha da classe">
      {(rows.length > 0 || raw || onEdit) && (
        <div>
          <div className={handles.clsSheetHead}>
            <h2 className={handles.clsSheetTitle}>Proficiências</h2>
            {onEdit && (
              <button
                type="button"
                className={`${shared.clsIconBtn} ${shared.clsIconBtn}--sm`}
                onClick={onEdit}
                aria-label="Editar ficha da classe"
                title="Editar ficha"
              >
                <PencilIcon />
              </button>
            )}
          </div>
          <dl className={handles.clsFields}>
            {rows.map(([label, value]) => (
              <div key={label} className={handles.clsField}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {raw && <p className={handles.clsRaw}>{raw}</p>}
        </div>
      )}

      {(k.startingEquipment?.length ?? 0) > 0 && (
        <div>
          <h2 className={handles.clsSheetTitle}>Equipamento inicial</h2>
          <ul className={handles.clsEquip}>
            {k.startingEquipment?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {(k.aliases?.length ?? 0) > 0 && (
        <div>
          <h2 className={handles.clsSheetTitle}>Também escrita como</h2>
          <ul className={handles.clsChips}>
            {k.aliases?.map((alias) => (
              <li key={alias} className={handles.clsChip}>
                {alias}
              </li>
            ))}
          </ul>
        </div>
      )}

      {k.sourceUrl && (
        <p className={handles.clsSource}>
          Fonte:{' '}
          <a href={k.sourceUrl} target="_blank" rel="noopener noreferrer">
            tópico no fórum ↗
          </a>
          {importedAt && (
            <>
              <br />
              Importada em {importedAt}
            </>
          )}
        </p>
      )}
    </aside>
  );
};

export default Sheet;
