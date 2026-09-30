import type { ReactNode } from 'react';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import type { Transition } from '../usePlayerSheet';
import ScreenHandles from './handles';

interface IProps {
  id: string;
  labelledBy: string;
  title: string;
  sub?: ReactNode;
  transition: Transition;
  onBack: () => void;
  children: ReactNode;
}

const Screen = ({
  id,
  labelledBy,
  title,
  sub,
  transition,
  onBack,
  children,
}: IProps) => {
  const handles = useCssHandles(ScreenHandles);

  return (
    <section
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={`${handles.sheetScreen}${
        transition !== 'none'
          ? ` ${applyModifiers(handles.sheetScreen, transition)}`
          : ''
      }`}
    >
      <div className={handles.sheetScreenHead}>
        <div className={handles.sheetScreenHeading}>
          <button
            type="button"
            className={handles.sheetBack}
            data-back
            onClick={onBack}
          >
            ‹ Menu
          </button>
          <h2 className={handles.sheetScreenTitle}>{title}</h2>
        </div>
        {sub && <div className={handles.sheetScreenSub}>{sub}</div>}
      </div>
      {children}
    </section>
  );
};

export default Screen;
