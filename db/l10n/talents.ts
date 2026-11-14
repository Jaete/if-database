import type ITalentDoc from '../talents/talent.d';
import { isStackableTalent } from '../../lib/stackableTalent';

/**
 * Rótulos do talento geral, em pt-BR.
 *
 * Mora aqui pelo mesmo motivo de `spells.ts` e `classes.ts`: a mesma lista
 * serve à página de talentos, ao formulário de edição e ao resumo da linha.
 * A ordem é a do tópico do fórum, que é como quem cadastra lê.
 */
export const TALENT_FIELDS: readonly {
  name: keyof ITalentDoc;
  label: string;
  multiline?: boolean;
}[] = [
  { name: 'category', label: 'Categoria' },
  { name: 'prerequisites', label: 'Pré-requisitos', multiline: true },
  { name: 'benefit', label: 'Benefício', multiline: true },
  { name: 'slotIncrease', label: 'Aumento de Slot' },
  { name: 'normal', label: 'Normal', multiline: true },
  { name: 'special', label: 'Especial', multiline: true },
  { name: 'description', label: 'Observações', multiline: true },
];

/** Resumo de uma linha da listagem: a categoria e o pré-requisito. */
export const talentSummary = (talent: ITalentDoc): string =>
  [talent.prerequisites?.replace(/\s+/g, ' '), talent.benefit]
    .filter(Boolean)
    .join(' · ');

/** `stackable` no formulário: detectar pelo texto, ou decisão explícita. */
const STACKABLE_OPTIONS = [
  { value: 'auto', label: 'Detectar pelo texto' },
  { value: 'sim', label: 'Sim, pode ser pego mais de uma vez' },
  { value: 'nao', label: 'Não, só uma vez' },
] as const;

const stackableValue = (talent?: ITalentDoc) =>
  talent?.stackable === true
    ? 'sim'
    : talent?.stackable === false
      ? 'nao'
      : 'auto';

/** O que a detecção diz hoje — para o formulário mostrar o que "auto" resolve. */
export const detectedStackable = (talent?: ITalentDoc): boolean =>
  isStackableTalent(
    [
      talent?.benefit,
      talent?.normal,
      talent?.special,
      talent?.description,
      talent?.prerequisites,
    ]
      .filter(Boolean)
      .join('\n')
  );

export const talentPromptFields = (talent?: ITalentDoc) => [
  {
    name: 'name',
    label: 'Nome do talento',
    required: true,
    initialValue: talent?.name ?? '',
    placeholder: 'ex.: Mestre em Defesa com Escudo',
  },
  ...TALENT_FIELDS.map((field) => ({
    name: String(field.name),
    label: field.label,
    required: false,
    type: field.multiline ? ('multiline' as const) : undefined,
    initialValue: (talent?.[field.name] as string | undefined) ?? '',
  })),
  {
    name: 'stackable',
    label: `Pode ser pego mais de uma vez (hoje: ${
      detectedStackable(talent) ? 'sim' : 'não'
    } pelo texto)`,
    required: false,
    options: STACKABLE_OPTIONS,
    initialValue: stackableValue(talent),
  },
];

export const talentFromPrompt = (
  values: Record<string, string>
): Partial<ITalentDoc> => {
  const next: Partial<ITalentDoc> = { name: values.name?.trim() };
  for (const field of TALENT_FIELDS) {
    const value = values[String(field.name)]?.trim();
    // `undefined`, não string vazia: é o que apaga o campo em vez de gravar
    // um branco que a tela exibiria como " · ".
    (next as Record<string, unknown>)[String(field.name)] = value || undefined;
  }
  // `null`, e não `undefined`: o corpo vai por JSON, que descartaria a chave e
  // deixaria o valor antigo gravado. Quem lê trata `null` como "detectar".
  (next as Record<string, unknown>).stackable =
    values.stackable === 'sim'
      ? true
      : values.stackable === 'nao'
        ? false
        : null;
  return next;
};
