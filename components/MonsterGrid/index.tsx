'use client';

import { useState, useMemo, useEffect } from 'react';

import type IMonster from '@/db/monsters/monsters.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import MonsterCard from '../MonsterCard';
import CreatureDrawer from '../CreatureDrawer';
import MonsterData from '../MonsterData';
import MonsterGridHandles from './handles';
import '@/styles/components/monsterGrid.scss';
import DrawerController from '../CreatureDrawer/sections/DrawerController';
import DrawerHeader from '../CreatureDrawer/sections/DrawerHeader';
import DrawerContent from '../CreatureDrawer/sections/DrawerContent';

interface IProps {
  monsters: IMonster[];
}

const MonsterGrid = ({ monsters }: IProps) => {
  const handles = useCssHandles(MonsterGridHandles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonster, setSelectedMonster] = useState<IMonster | null>(null);

  const filteredMonsters = useMemo(() => {
    return monsters.filter((monster) =>
      monster.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [monsters, searchTerm]);

  useEffect(() => {
    const handleClose = () => setSelectedMonster(null);
    window.addEventListener('drawer:close', handleClose);

    return () => {
      window.removeEventListener('drawer:close', handleClose);
    };
  }, []);

  return (
    <div className={handles.container}>
      <header className={handles.header}>
        <h1 className={handles.title}>BESTIÁRIO SALVO</h1>
        <p className={handles.subtitle}>
          Seus monstros salvos no banco de dados e as alterações recentes do
          navegador.
        </p>
        <div className={handles.navButtons}>
          <button className={handles.navButton}>+ CRIAR NOVO MONSTRO</button>
          <button className={handles.navButton}>
            GERAR ÁRVORE DE MONSTROS
          </button>
        </div>
      </header>

      <div className={handles.searchContainer}>
        <input
          type="text"
          className={handles.searchInput}
          placeholder="Buscar monstro pelo nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={handles.grid}>
        {filteredMonsters.map((monster) => (
          <DrawerController key={monster.slug}>
            <MonsterCard
              key={monster.slug + '--card'}
              monster={monster}
              onClick={setSelectedMonster}
            />
          </DrawerController>
        ))}
        {filteredMonsters.length === 0 && (
          <div className={handles.emptyState}>Nenhum monstro encontrado.</div>
        )}
      </div>

      <CreatureDrawer>
        <DrawerHeader />
        <DrawerContent>
          {selectedMonster && <MonsterData monster={selectedMonster} />}
        </DrawerContent>
      </CreatureDrawer>
    </div>
  );
};

export default MonsterGrid;
