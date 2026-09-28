'use client';

import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import TabBarHandles from './handles';
import { useTabs } from '@/app/context/TabContext';
import '@/styles/components/tabBar.scss';

const TabBar = () => {
  const handles = useCssHandles(TabBarHandles);
  const { tabs, activeTabId, setActiveTabId, closeTab } = useTabs();

  if (tabs.length === 0) return null;

  return (
    <div className={handles.tabBar}>
      <div className={handles.tabBarList}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const itemClass = isActive
            ? `${handles.tabBarItem} ${applyModifiers(handles.tabBarItem, 'active')}`
            : handles.tabBarItem;

          return (
            <button
              key={tab.id}
              type="button"
              className={itemClass}
              onClick={() => setActiveTabId(tab.id)}
            >
              <span className={handles.tabBarLabel}>{tab.label}</span>
              <span
                className={handles.tabBarCloseBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                role="button"
                aria-label={`Fechar ${tab.label}`}
              >
                &times;
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabBar;
