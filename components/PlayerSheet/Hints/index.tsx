import { useCssHandles } from '@/hooks/useCssHandles';
import HintsHandles from './handles';

interface IProps {
  message: string;
}

const Hints = ({ message }: IProps) => {
  const handles = useCssHandles(HintsHandles);

  return (
    <footer className={handles.sheetHints}>
      <div className={handles.sheetHintsKeys} aria-hidden="true">
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> Mover
        </span>
        <span>
          <kbd>Enter</kbd> Abrir
        </span>
        <span>
          <kbd>→</kbd> Entrar
        </span>
        <span>
          <kbd>Esc</kbd> Voltar
        </span>
      </div>
      <div
        className={handles.sheetHintsMessage}
        role="status"
        aria-live="polite"
      >
        {message}
      </div>
    </footer>
  );
};

export default Hints;
