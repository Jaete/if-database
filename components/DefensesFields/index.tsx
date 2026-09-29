'use client';

import { useState } from 'react';

import { defensesMapping } from '@/db/l10n/attributesMapping';
import ELEMENTS from '@/db/l10n/elements';
import { normalizeList } from '@/lib/listValues';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import FormField from '@/components/FormField';
import DefensesFieldsHandles from './handles';
import '@/styles/components/defensesFields.scss';

type DefenseCategory = keyof typeof defensesMapping;

// Só fraqueza e resistência recebem o atalho: imunidades a dano e a condições
// raramente são elementais.
const PICKER_CATEGORIES: DefenseCategory[] = ['vulnerabilities', 'resistances'];

interface IProps {
  defenses: Record<string, string[] | undefined>;
  onChange: (category: string, value: string) => void;
}

const DefensesFields = ({ defenses, onChange }: IProps) => {
  const handles = useCssHandles(DefensesFieldsHandles);

  // O valor exibido vem do array já separado, então digitar uma vírgula a
  // apagaria no mesmo instante. Enquanto o campo está sendo editado o texto
  // cru manda; ao sair, volta a refletir o array.
  const [drafts, setDrafts] = useState<
    Partial<Record<DefenseCategory, string>>
  >({});

  const itemsOf = (category: DefenseCategory) =>
    normalizeList(defenses[category]);

  const has = (items: string[], element: string) =>
    items.some((item) => item.toLowerCase() === element.toLowerCase());

  const clearDraft = (category: DefenseCategory) =>
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[category];
      return next;
    });

  // Clicar alterna: adiciona se faltar, remove se já estiver na lista, para que
  // um clique errado se desfaça do mesmo jeito que foi feito.
  const toggleElement = (category: DefenseCategory, element: string) => {
    const current = itemsOf(category);
    const next = has(current, element)
      ? current.filter((item) => item.toLowerCase() !== element.toLowerCase())
      : [...current, element];

    clearDraft(category);
    onChange(category, next.join(', '));
  };

  return (
    <div className={handles.defensesFields}>
      {(Object.keys(defensesMapping) as DefenseCategory[]).map((category) => {
        const items = itemsOf(category);

        return (
          <div key={category} className={handles.defensesField}>
            <FormField
              label={defensesMapping[category]}
              value={drafts[category] ?? items.join(', ')}
              onChange={(e) => {
                const raw = e.target.value;
                setDrafts((prev) => ({ ...prev, [category]: raw }));
                onChange(category, raw);
              }}
              onBlur={() => clearDraft(category)}
            />

            {PICKER_CATEGORIES.includes(category) && (
              <div className={handles.elementPicker}>
                <span className={handles.elementPickerLabel}>Elementos</span>
                {ELEMENTS.map((element) => {
                  const active = has(items, element);

                  return (
                    <button
                      key={element}
                      type="button"
                      aria-pressed={active}
                      className={`${handles.elementPill}${
                        active
                          ? ` ${applyModifiers(handles.elementPill, 'active')}`
                          : ''
                      }`}
                      onClick={() => toggleElement(category, element)}
                    >
                      {element}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DefensesFields;
