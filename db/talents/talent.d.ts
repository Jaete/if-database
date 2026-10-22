import { Document } from 'mongoose';

/**
 * Um talento geral — entidade própria, como a magia do grimório.
 *
 * Só os GERAIS moram aqui. Os talentos de classe continuam dentro do documento
 * da classe (`ICharacterClass.talents`), onde a importação do tópico da classe
 * já os põe, pela mesma razão de as características de classe não terem
 * coleção: eles só existem no contexto daquela classe, são lidos junto dela e
 * nunca são compartilhados. Quem soma as duas listas é
 * `services/talent.service.ts`, para quem escolhe na ficha ver uma lista só.
 *
 * A diferença para a magia é que o talento geral vale para qualquer
 * personagem: não há `classIds` aqui, só a `category` que o tópico do fórum
 * usa para agrupá-los (Combate, Metamágica, Reserva, Estilo...).
 */
export interface ITalentDoc extends Document {
  name: string;
  slug: string;

  /**
   * A categoria do fórum: cada post do tópico de talentos é uma
   * ("Talentos Gerais", "Talento de Combate", "Metacanto"...). É o eixo pelo
   * qual a página agrupa e filtra.
   */
  category?: string;

  /** "Pré-requisitos:" do tópico. Ausente quando a linha trazia só "—". */
  prerequisites?: string;
  /** "Benefício:" — o que o talento faz. */
  benefit?: string;
  /** "Normal:" — o que quem não tem o talento fica impedido de fazer. */
  normal?: string;
  /** "Especial:" — observações fora do padrão. */
  special?: string;
  /** "Aumento de Slot:" — só nos de metamágica e metacanto. */
  slotIncrease?: string;

  /** O que não casou com nenhum rótulo conhecido, preservado em vez de perdido. */
  description?: string;

  /** Tópico de onde veio, para reimportar e para citar a fonte. */
  sourceUrl?: string;
  importedAt?: Date;
}

export default ITalentDoc;
