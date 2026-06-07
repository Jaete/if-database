'use client';

import { useState, useMemo, useEffect } from 'react';

import type ICreature from '@/db/creatures/creatures.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import CreatureCard from '../CreatureCard';
import CreatureDrawer from '../CreatureDrawer';
import CreatureData from '../CreatureData';
import Modal from '../Modal';
import CreatureEditForm from '../CreatureEditForm';
import CreatureGridHandles from './handles';
import '@/styles/components/creatureGrid.scss';
import DrawerController from '../CreatureDrawer/sections/DrawerController';
import DrawerHeader from '../CreatureDrawer/sections/DrawerHeader';
import DrawerContent from '../CreatureDrawer/sections/DrawerContent';
import { useMonsters } from '@/app/context/MonstersContext';

const CreatureGrid = () => {
  const { monsters } = useMonsters();
  const handles = useCssHandles(CreatureGridHandles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreature, setSelectedCreature] = useState<ICreature | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredCreatures = useMemo(() => {
    return monsters.filter((monster) =>
      monster.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [monsters, searchTerm]);

  useEffect(() => {
    const handleClose = () => {
      if (!isEditModalOpen) {
        setSelectedCreature(null);
      }
    };
    window.addEventListener('drawer:close', handleClose);

    return () => {
      window.removeEventListener('drawer:close', handleClose);
    };
  }, [isEditModalOpen]);

  const handleEditClick = (creature: ICreature) => {
    setSelectedCreature(creature);
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewClick = (creature: ICreature) => {
    setSelectedCreature(creature);
  };

  return (
    <div className={handles.container}>
      <header className={handles.header}>
        <h1 className={handles.title}>BESTIÁRIO SALVO</h1>
        <p className={handles.subtitle}>
          Suas criaturas salvas no banco de dados e as alterações recentes do
          navegador.
        </p>
        <div className={handles.navButtons}>
          <button className={handles.navButton} onClick={handleCreateClick}>
            + CRIAR NOVA CRIATURA
          </button>
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
              onClick={handleViewClick}
              onEdit={handleEditClick}
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
          {selectedCreature && !isEditModalOpen && (
            <CreatureData creature={selectedCreature} />
          )}
        </DrawerContent>
      </CreatureDrawer>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCreature(null);
        }}
        title={
          selectedCreature
            ? `Editando: ${selectedCreature.name}`
            : 'Editar Criatura'
        }
      >
        {selectedCreature && (
          <CreatureEditForm
            creature={selectedCreature}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCreature(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Nova Criatura"
      >
        <CreatureEditForm
          creature={{} as ICreature}
          mode="create"
          onClose={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default CreatureGrid;
