import ICitizen from '../citizens/citizen';

/**
 * Personagem de jogador. Em dados é um cidadão com dono e procedência.
 *
 * "Jogador" aqui é a pessoa — uma conta do fórum que já existe em `db/users`.
 * Um jogador tem vários personagens, então o vínculo mora neste lado.
 */
export default interface IPlayer extends ICitizen {
  // Chave para db/users, onde forumUserId é unique + sparse.
  ownerForumUserId?: number;
  // Desnormalizado para listar e buscar sem join.
  ownerUsername?: string;
  // Tópico do fórum de onde a ficha veio, quando importada.
  forumTopicUrl?: string;
  importedAt?: Date;
}
