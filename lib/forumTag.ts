/**
 * A etiqueta que incorpora a ficha num post do fórum.
 *
 * O fórum lê `[ficha=<id>]` e troca pelo iframe de `/embed/jogador/<id>` (ver
 * `app/(embed)`). Mora aqui, e não dentro do botão que a copia, porque são
 * dois lugares copiando a mesma coisa — o menu do cartão e o painel do
 * jogador — e a etiqueta errada só apareceria depois de colada lá.
 */
export const fichaTag = (id: string) => `[ficha=${id}]`;
