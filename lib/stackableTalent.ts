/**
 * Um talento que se pode pegar mais de uma vez, lido do texto dele.
 *
 * O tópico do fórum não tem um campo para isso: a regra aparece em prosa
 * ("este talento pode ser escolhido várias vezes", "pode ser adquirido até três
 * vezes", "ao escolher este talento pela primeira vez..."). Função pura, para
 * o servidor (catálogo) e o formulário de edição usarem a mesma resposta.
 *
 * Conservadora de propósito: só a frase que fala DO talento ser pego de novo.
 * "Pode usar essa habilidade várias vezes" e "não pode atingir o mesmo inimigo
 * mais de uma vez" são sobre o uso, não sobre a escolha, e ficam de fora. Um
 * falso negativo se corrige no formulário (campo `stackable`); um falso
 * positivo deixaria a ficha aceitar um talento repetido que a regra proíbe.
 */

const fold = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const AGAIN =
  '(?:mais de uma vez|varias vezes|multiplas vezes|diversas vezes|muitas vezes|novamente|outra vez|ate \\w+ vezes)';
const TAKE = '(?:escolh|selecion|adquir|compr|peg|tom)';
const THING = '(?:talento|opcao|truque|poder|habilidade)';

const PATTERNS: readonly RegExp[] = [
  // "pode ser escolhido várias vezes", "pode ser adquirido até três vezes".
  new RegExp(`\\bpode(?:m)? ser ${TAKE}\\w*\\s+${AGAIN}`),
  // "pode selecionar esse talento várias vezes", "um guerreiro pode escolher
  // esta opção mais de uma vez", "pode escolher este talento novamente".
  new RegExp(
    `\\bpode(?:m)?\\s+${TAKE}\\w*\\s+(?:este|esse|esta|essa)\\s+${THING}\\w*(?:\\s+de\\s+\\w+)?\\s+${AGAIN}`
  ),
  // "ao escolher este talento pela primeira vez" só faz sentido se há segunda.
  new RegExp(`${TAKE}\\w*\\s+(?:este|esse)\\s+talento\\s+pela primeira vez`),
];

export function isStackableTalent(text: string | undefined): boolean {
  if (!text) return false;
  const source = fold(text);
  return PATTERNS.some((pattern) => pattern.test(source));
}
