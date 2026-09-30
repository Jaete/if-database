import { useCssHandles } from '@/hooks/useCssHandles';
import EmbedNotFoundHandles from './handles';
import '@/styles/components/embedNotFound.scss';

const EmbedNotFound = () => {
  const handles = useCssHandles(EmbedNotFoundHandles);

  return (
    <section className={handles.embedNotFound}>
      <h1 className={handles.embedNotFoundTitle}>Ficha não encontrada</h1>
      <p className={handles.embedNotFoundText}>
        Este personagem não existe ou o endereço da ficha está incorreto.
      </p>
    </section>
  );
};

export default EmbedNotFound;
