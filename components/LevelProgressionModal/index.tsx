'use client';

import Modal from '@/components/Modal';
import type IMonster from '@/db/monsters/monster';
import { useCssHandles } from '@/hooks/useCssHandles';
import { attrMapping } from '@/db/l10n/attributesMapping';
import LevelProgressionModalHandles from './handles';
import '@/styles/components/levelProgressionModal.scss';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  monster: IMonster | null;
}

const perkTypeLabels: Record<string, string> = {
  atributo: 'Aumento de Atributo',
  habilidade: 'Nova Habilidade',
  acao: 'Nova Ação',
  classe: 'Melhoria de Classe',
};

const LevelProgressionModal = ({ isOpen, onClose, monster }: IProps) => {
  const handles = useCssHandles(LevelProgressionModalHandles);
  const allLevels = monster?.levels ?? [];
  const hasLevels = allLevels.length > 0;
  const modalTitle = hasLevels ? `Progressão: ${monster!.name}` : undefined;

  return (
    <Modal
      isOpen={!!(isOpen && hasLevels)}
      onClose={onClose}
      title={modalTitle}
    >
      {hasLevels ? (
        <div className={handles.progression}>
          {allLevels.map((level) => (
            <div key={level.level} className={handles.levelCard}>
              <div className={handles.levelBadge}>Nível {level.level}</div>

              {level.acquiredPerks.map((perk, i) => (
                <div key={i} className={handles.perkItem}>
                  <span className={handles.perkType}>
                    {perkTypeLabels[perk.type] || perk.type}
                  </span>

                  {perk.type === 'atributo' ? (
                    <span className={handles.perkName}>
                      {attrMapping[
                        perk.attribute as keyof typeof attrMapping
                      ] || perk.attribute?.toUpperCase()}
                      {perk.value != null && (
                        <span className={handles.perkDescription}>
                          {' '}
                          +{perk.value}
                        </span>
                      )}
                    </span>
                  ) : (
                    <>
                      <span className={handles.perkName}>{perk.name}</span>
                      {perk.description && (
                        <p className={handles.perkDescription}>
                          {perk.description}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </Modal>
  );
};

export default LevelProgressionModal;
