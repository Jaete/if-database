'use client';

import type IMonster from '@/db/monsters/monster';
import { useCssHandles } from '@/hooks/useCssHandles';
import { useMonsterSearch } from './useMonsterSearch';
import MonsterSearchHandles from './handles';
import '@/styles/components/monsterSearch.scss';

interface IProps {
  monsters: IMonster[];
  onSelect: (monsterId: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onClose?: () => void;
}

const MonsterSearch = ({
  monsters,
  onSelect,
  placeholder = 'Buscar criatura...',
  autoFocus = false,
  onClose,
}: IProps) => {
  const handles = useCssHandles(MonsterSearchHandles);
  const {
    query,
    isOpen,
    filtered,
    containerRef,
    handleChange,
    handleFocus,
    handleSelect,
  } = useMonsterSearch({ monsters, onSelect, autoFocus, onClose });

  return (
    <div ref={containerRef} className={handles.monsterSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={handles.monsterSearchInput}
      />
      {isOpen && filtered.length > 0 && (
        <div className={handles.monsterSearchDropdown}>
          {filtered.map((m) => (
            <div
              key={m.slug}
              onClick={() => handleSelect(m.slug)}
              className={handles.monsterSearchOption}
            >
              {(m.icon || m.image) && (
                <img
                  src={m.icon || m.image}
                  alt={m.name}
                  className={handles.monsterSearchOptionImage}
                />
              )}
              <span className={handles.monsterSearchOptionName}>{m.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonsterSearch;
