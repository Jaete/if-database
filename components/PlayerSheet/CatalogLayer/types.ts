/** O que a ficha pede ao abrir a camada de escolha. */
export type CatalogRequest =
  | {
      kind: 'race';
      /**
       * `mixed`: abre direto a página do Mestiço (revisar a mestiçagem).
       * `current`: abre a página da raça de hoje (ajustar a sub-raça).
       */
      focus?: 'mixed' | 'current';
    }
  | { kind: 'class' }
  | { kind: 'archetype' }
  | { kind: 'spells'; circle?: number }
  | { kind: 'talents'; at: number };

/** Uma tela empilhada: a lista, a página de uma raça, ou uma origem. */
export interface ICatalogScreen {
  id: string;
  label: string;
  /** Só nas raças: a página aberta e se é a de uma origem do Mestiço. */
  slug?: string;
  mode?: 'pick' | 'origin';
}

/** Uma linha de "A ficha ganha" / "Sai da ficha" na bandeja. */
export interface ITrayLine {
  text: string;
  hint?: string;
}

export interface ITrayInfo {
  /** "Elfo → Mestiço (Elfos + Humanos)". Vazio quando nada mudou. */
  before: string;
  after: string;
  gains: ITrayLine[];
  removes: ITrayLine[];
  warnings: string[];
  changed: boolean;
  /** O botão de aplicar fica desligado (nada mudou, ou falta o essencial). */
  canApply: boolean;
  applyLabel: string;
  /** Trocar de classe pede uma segunda confirmação, na própria bandeja. */
  confirmRemoval: boolean;
}
