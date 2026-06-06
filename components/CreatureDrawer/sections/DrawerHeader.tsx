import { useCssHandles } from '@/hooks/useCssHandles';
import CreatureDrawerHandles from '../handles';

const DrawerHeader = () => {
  const handles = useCssHandles(CreatureDrawerHandles);

  const handleClose = () => {
    window.dispatchEvent(new CustomEvent('drawer:close', { bubbles: true }));
  };

  return (
    <div className={handles.drawerHeaderBar}>
      <button
        className={handles.closeBtn}
        onClick={handleClose}
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  );
};

export default DrawerHeader;
