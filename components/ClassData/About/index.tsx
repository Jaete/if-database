'use client';

import { useState } from 'react';
import type ICharacterClass from '@/db/classes/class.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import { PencilIcon, PlusIcon } from '../../Icons';
import Description from '../Description';
import ClassDataHandles from '../handles';
import AboutHandles from './handles';

interface IProps {
  characterClass: ICharacterClass;
  canEdit: boolean;
  saving: boolean;
  /** Resolve `true` quando gravou; com erro, o rascunho continua aberto. */
  onSave: (description: string) => Promise<boolean>;
}

/**
 * "Sobre a classe": a descrição longa, com edição no próprio texto
 * (Ctrl+Enter salva, Esc cancela).
 */
const About = ({ characterClass: k, canEdit, saving, onSave }: IProps) => {
  const handles = useCssHandles(AboutHandles);
  const shared = useCssHandles(ClassDataHandles);
  // Rascunho da descrição editada no lugar; null é o texto em leitura.
  const [draft, setDraft] = useState<string | null>(null);

  const submit = async () => {
    if (draft === null) return;
    // Fecha só se gravou: com erro, o rascunho continua para tentar de novo.
    if (await onSave(draft)) setDraft(null);
  };

  let body;
  if (draft !== null) {
    body = (
      <div className={handles.clsAboutEditor}>
        <textarea
          className={handles.clsAboutInput}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setDraft(null);
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
              submit();
            }
          }}
          placeholder="O que a classe é."
          aria-label="Descrição da classe"
          autoFocus
        />
        <div className={handles.clsAboutFoot}>
          <span className={handles.clsAboutHint}>
            &quot;-&quot; faz um item de lista, &quot;--&quot; um sub-item ·{' '}
            <kbd>Ctrl</kbd>+<kbd>Enter</kbd> salva · <kbd>Esc</kbd> cancela
          </span>
          <button
            type="button"
            className={`${shared.clsBtn} ${shared.clsBtn}--ghost`}
            onClick={() => setDraft(null)}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`${shared.clsBtn} ${shared.clsBtn}--primary`}
            onClick={submit}
            disabled={saving}
          >
            Salvar
          </button>
        </div>
      </div>
    );
  } else if (k.description) {
    body = (
      <div className={handles.clsAboutBody}>
        <Description text={k.description} />
      </div>
    );
  } else if (canEdit) {
    body = (
      <button
        type="button"
        className={handles.clsAboutAdd}
        onClick={() => setDraft('')}
      >
        <PlusIcon />
        Descrição
      </button>
    );
  } else {
    body = <p className={handles.clsAboutEmpty}>Sem descrição.</p>;
  }

  return (
    <section className={handles.clsAbout} aria-labelledby="class-about-title">
      <div className={handles.clsAboutHead}>
        <h2 id="class-about-title" className={handles.clsAboutTitle}>
          Sobre a classe
        </h2>
        {canEdit && k.description && draft === null && (
          <button
            type="button"
            className={shared.clsIconBtn}
            onClick={() => setDraft(k.description ?? '')}
            aria-label="Editar descrição"
            title="Editar descrição"
          >
            <PencilIcon />
          </button>
        )}
      </div>
      {body}
      {(k.unparsedSections?.length ?? 0) > 0 && (
        <p className={handles.clsNote}>
          O texto deste tópico não pôde ser estruturado com segurança — só a
          progressão por nível foi importada. O conteúdo original foi preservado
          e pode ser preenchido à mão.
        </p>
      )}
    </section>
  );
};

export default About;
