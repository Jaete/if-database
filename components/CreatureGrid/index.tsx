'use client';

import { useState, useMemo, useEffect } from 'react';

import type ICreature from '@/db/creatures/creatures.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import CreatureCard from '../CreatureCard';
import CreatureDrawer from '../CreatureDrawer';
import CreatureData from '../CreatureData';
import CreatureGridHandles from './handles';
import '@/styles/components/creatureGrid.scss';
import DrawerController from '../CreatureDrawer/sections/DrawerController';
import DrawerHeader from '../CreatureDrawer/sections/DrawerHeader';
import DrawerContent from '../CreatureDrawer/sections/DrawerContent';

interface IProps {
  creatures: ICreature[];
}

const CreatureGrid = ({ creatures }: IProps) => {
  const handles = useCssHandles(CreatureGridHandles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreature, setSelectedCreature] = useState<ICreature | null>(
    null
  );

  const filteredCreatures = useMemo(() => {
    return creatures.filter((creature) =>
      creature.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [creatures, searchTerm]);

  useEffect(() => {
    const handleClose = () => setSelectedCreature(null);
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
          Suas criaturas salvas no banco de dados e as alterações recentes do
          navegador.
        </p>
        <div className={handles.navButtons}>
          <button className={handles.navButton}>+ CRIAR NOVA CRIATURA</button>
          <button className={handles.navButton}>
            GERAR ÁRVORE DE CRIATURAS
          </button>
        </div>
      </header>

      <div className={handles.searchContainer}>
        <input
          type="text"
          className={handles.searchInput}
          placeholder="Buscar criatura pelo nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={handles.grid}>
        {filteredCreatures.map((creature) => (
          <DrawerController key={creature.slug}>
            <CreatureCard
              key={creature.slug + '--card'}
              creature={creature}
              onClick={setSelectedCreature}
            />
          </DrawerController>
        ))}
        {filteredCreatures.length === 0 && (
          <div className={handles.emptyState}>Nenhuma criatura encontrada.</div>
        )}
      </div>

      <CreatureDrawer>
        <DrawerHeader />
        <DrawerContent>
          {selectedCreature && <CreatureData creature={selectedCreature} />}
        </DrawerContent>
      </CreatureDrawer>
    </div>
  );
};

export default CreatureGrid;
