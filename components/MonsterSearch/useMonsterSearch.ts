'use client';

import { useState, useRef, useEffect } from 'react';
import type IMonster from '@/db/monsters/monster';

interface IUseMonsterSearchParams {
  monsters: IMonster[];
  onSelect: (monsterId: string) => void;
  autoFocus?: boolean;
  onClose?: () => void;
}

export const useMonsterSearch = ({
  monsters,
  onSelect,
  autoFocus = false,
  onClose,
}: IUseMonsterSearchParams) => {
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

  const handleChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);
  };

  const handleFocus = () => setIsOpen(true);

  const handleSelect = (slug: string) => {
    onSelect(slug);
    setQuery('');
    setIsOpen(false);
  };

  return {
    query,
    isOpen,
    filtered,
    containerRef,
    handleChange,
    handleFocus,
    handleSelect,
  };
};
