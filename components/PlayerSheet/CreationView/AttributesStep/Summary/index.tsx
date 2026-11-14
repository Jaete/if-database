'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { ATTRIBUTES, type IAttrLine } from '@/lib/creation';
import { ATTRIBUTE_LABELS } from '@/lib/levelUp';
import { formatModifier, type AttributeKey } from '@/lib/stats';
import CreationViewHandles from '../../handles';

interface IProps {
  totals: Record<AttributeKey, IAttrLine>;
  placed: boolean;
  hp: number | null;
  hitDie: number | null;
}

/** O resumo ao vivo: base, raça, total, modificador e a vida resultante. */
const Summary = ({ totals, placed, hp, hitDie }: IProps) => {
  const handles = useCssHandles(CreationViewHandles);
  return (
    <aside className={handles.crSummary} aria-live="polite">
      <table>
        <thead>
          <tr>
            <th scope="col">Atr.</th>
            <th scope="col">Base</th>
            <th scope="col">Raça</th>
            <th scope="col">Total</th>
            <th scope="col">Mod.</th>
          </tr>
        </thead>
        <tbody>
          {ATTRIBUTES.map((key) => {
            const t = totals[key];
            return (
              <tr key={key} className={handles.crSummaryRow}>
                <th scope="row">{ATTRIBUTE_LABELS[key][0]}</th>
                <td>{t.base || '–'}</td>
                <td>{t.race ? `+${t.race}` : '·'}</td>
                <td>
                  <b>{t.base ? t.total : '–'}</b>
                </td>
                <td>{t.base ? formatModifier(t.mod) : '–'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        Vida no nível 1:{' '}
        <b>{hp !== null ? hp : hitDie ? (placed ? '?' : '–') : 'a definir'}</b>
        {hitDie ? ` (d${hitDie} máximo + CON)` : ''}
      </p>
    </aside>
  );
};

export default Summary;
