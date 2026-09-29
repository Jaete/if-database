/**
 * Os elementos de Terralém, na ordem do ciclo de vantagem do mundo
 * (Vento ▸ Terra ▸ Raio ▸ Água ▸ Fogo ▸ Gelo ▸ Vento), seguidos do par
 * Sombra/Sagrado, que fica fora desse ciclo.
 *
 * Serve só para sugerir valores nos campos de defesa: as mesmas listas também
 * guardam tipos de dano convencionais (cortante, necrótico) e condições, então
 * nada aqui é validado nem derivado — quem cadastra a ficha decide.
 */
const ELEMENTS = [
  'Vento',
  'Terra',
  'Raio',
  'Água',
  'Fogo',
  'Gelo',
  'Sombra',
  'Sagrado',
] as const;

export default ELEMENTS;
