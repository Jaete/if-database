import ICitizen from '../citizens/citizen';
import type {
  AttributeMethod,
  Base,
  ICreationGrantPicks,
  PlayerStatus,
} from '../../lib/creation';
import type {
  IFeatureChoiceRecord,
  ILevelLock,
  INovelty,
} from '../../lib/levelUp';

/** O que a dona escolheu na criação e que a ficha pronta não mostra sozinha. */
export interface ICreationState {
  method?: AttributeMethod;
  /** Valores base atribuídos a cada atributo (antes dos bônus da raça). */
  base?: Base;
  /** Os totais da rolagem 4d6 ficam em `creationrolls`; aqui só o vínculo. */
  rollId?: string;
  /** O atributo de cada "+N à escolha" da raça, na ordem. */
  racialPicks?: string[];
  /** As opções "ou" do nível 1, uma por concessão com escolha. */
  featureChoices?: string[];
  /** O gil rolado (a rolagem em si fica em `creationrolls`). */
  startingGil?: number;
  /** As perícias da CLASSE escolhidas; as raciais ficam em `grants`. */
  classSkills?: string[];
  /** O que a dona escolheu nas concessões da raça ("Concede na criação"). */
  grants?: Partial<ICreationGrantPicks>;
  /** Idioma extra escolhido (recomendado, não obrigatório). */
  extraLanguage?: string;
  submittedAt?: string;
}

export interface IReviewEntry {
  kind: 'submit' | 'return' | 'approve';
  notes?: string;
  steps?: string[];
  by: string;
  at: string;
}

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
  /**
   * Onde a ficha está no caminho da criação. Ausente = ficha antiga, já aceita.
   * Só os serviços de criação escrevem aqui (services/creation.service.ts).
   */
  status?: PlayerStatus;
  creation?: ICreationState;
  review?: IReviewEntry[];
  levelLocks?: ILevelLock[];
  featureChoices?: IFeatureChoiceRecord[];
  novelties?: INovelty[];
}
