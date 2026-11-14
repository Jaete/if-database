'use client';

import type { ReactNode } from 'react';
import { EditingProvider } from '../EditingContext';
import { useCreation } from '../CreationContext';

const readPath = (source: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === 'object'
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      source
    );

interface IProps {
  children: ReactNode;
}

/**
 * Dá à camada de escolha do códice (raça, classe, magias) o rascunho da
 * CRIAÇÃO no lugar da edição livre da ficha: ela lê o rascunho daqui e o que
 * ela aplica vira um passo do rascunho no servidor. Nada é gravado direto.
 *
 * A raça e a classe são conferidas pelo servidor (classe e raça únicas, limite
 * de magias); quem decide é a resposta, e a tela só mostra o que voltou.
 */
const CreationEditingBridge = ({ children }: IProps) => {
  const { player, patch } = useCreation();
  const read = <T,>(path: string) => readPath(player, path) as T | undefined;

  const setField = (path: string, next: unknown) => {
    if (path === 'raceId' || path === 'raceChoice' || path === 'classId') {
      patch({ fields: { [path]: next } });
    } else if (path === 'playerSpellcasting.spellRefs') {
      patch({
        fields: {
          playerSpellcasting: { spellRefs: next },
        },
      });
    }
    // O resto (texto da classe, arquétipo, talentos, marcos) é derivado ou não
    // existe no nível 1: o servidor refaz.
  };

  return (
    <EditingProvider
      editable
      value={(path) => {
        const v = readPath(player, path);
        return v === null || typeof v === 'object'
          ? undefined
          : (v as string | number | undefined);
      }}
      list={(path) => {
        const v = readPath(player, path);
        return Array.isArray(v)
          ? v.filter((i): i is string => typeof i === 'string')
          : [];
      }}
      objects={<T,>(path: string) => {
        const v = readPath(player, path);
        return Array.isArray(v) ? (v as T[]) : [];
      }}
      read={read}
      setField={setField}
      isFieldDirty={() => false}
      isDirtyUnder={() => false}
      revertField={() => {}}
    >
      {children}
    </EditingProvider>
  );
};

export default CreationEditingBridge;
