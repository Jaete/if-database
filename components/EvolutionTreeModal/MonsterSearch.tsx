'use client';

import { useState, useRef, useEffect } from 'react';
import type IMonster from '@/db/monsters/monster';

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
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? monsters.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
    : monsters;

  useEffect(() => {
    if (autoFocus && containerRef.current) {
      const input = containerRef.current.querySelector('input');
      input?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSelect = (slug: string) => {
    onSelect(slug);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          border: '1px solid #333',
          borderRadius: '4px',
          padding: '6px 12px',
          color: '#fff',
          fontSize: '14px',
          outline: 'none',
          minWidth: '180px',
          boxSizing: 'border-box',
        }}
      />
      {isOpen && filtered.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: '#1a1a1a',
            border: '1px solid #463900',
            borderRadius: '4px',
            zIndex: 100,
            marginTop: '4px',
          }}
        >
          {filtered.map((m) => (
            <div
              key={m.slug}
              onClick={() => handleSelect(m.slug)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '13px',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  '#262626';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  'transparent';
              }}
            >
              {(m.icon || m.image) && (
                <img
                  src={m.icon || m.image}
                  alt={m.name}
                  style={{
                    width: 24,
                    height: 24,
                    objectFit: 'contain',
                    borderRadius: 2,
                  }}
                />
              )}
              <span>{m.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonsterSearch;
