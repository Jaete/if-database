import type { IPromptField } from '../PromptModal';
import ImageField from '../ImageField';
import RolesField from './RolesField';
import '@/styles/components/classFieldEditors.scss';

/**
 * Troca os campos `image` e `roles` do formulário da classe pelos editores
 * próprios deles, mantendo o valor como texto.
 *
 * `db/l10n/classes.ts` não conhece React, então declara os dois como texto
 * puro; quem monta o modal passa a lista por aqui. Os outros campos seguem
 * como estão.
 */
const withClassEditors = (fields: IPromptField[]): IPromptField[] =>
  fields.map((field) => {
    if (field.name === 'image') {
      return {
        ...field,
        render: (value, onChange) => (
          <ImageField value={value} onChange={onChange} />
        ),
      };
    }
    if (field.name === 'roles') {
      return {
        ...field,
        render: (value, onChange) => (
          <RolesField value={value} onChange={onChange} />
        ),
      };
    }
    return field;
  });

export default withClassEditors;
