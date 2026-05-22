import Link from 'next/link';

import { useCssHandles } from '@/hooks/useCssHandles';
import MainMenuHandles from './handles';
import '@/styles/components/mainMenu.scss';

const MainMenu = () => {
  const handles = useCssHandles(MainMenuHandles);

  return (
    <div className={handles.container}>
      <div className={handles.titleContainer}>
        <h1 className={handles.title}>Isekai Fantasy</h1>
        <span className={handles.subtitle}>Editor</span>
      </div>

      <nav className={handles.menuList}>
        <div className={handles.menuItem}>
          <Link href="/creatures" className={handles.menuLink}>
            Bestiário
          </Link>
        </div>
        <div className={handles.menuItem}>
          <button className={handles.menuLinkDisabled} disabled>
            Cidadãos
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MainMenu;
