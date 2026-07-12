'use client';

import { type ICombat, type ISpeed } from '@/db/creatures/creatures.d';
import StatSection from '@/components/StatSection';
import InfoRow from '@/components/InfoRow';

interface IProps {
  combat: ICombat;
}

const getSpeedText = (speed?: ISpeed) => {
  if (!speed) return '---';
  const parts = [];
  if (speed.walk != null) parts.push(`${speed.walk} m`);
  if (speed.fly != null) parts.push(`voo ${speed.fly} m`);
  if (speed.swim != null) parts.push(`nado ${speed.swim} m`);
  if (speed.climb != null) parts.push(`escalar ${speed.climb} m`);
  if (speed.burrow != null) parts.push(`escavação ${speed.burrow} m`);
  if (speed.note) parts.push(`(${speed.note})`);
  return parts.join(', ') || '---';
};

const CombatInfo = ({ combat }: IProps) => (
  <StatSection title="Informações de Combate">
    <InfoRow label="Classe de Armadura:" valueId="armor-class">
      {combat.ac?.formula || combat.ac?.value || '---'}
    </InfoRow>
    <InfoRow label="Pontos de Vida:" valueId="hit-points">
      {combat.hp?.formula || combat.hp?.value || '---'}
    </InfoRow>
    <InfoRow label="Deslocamento:" valueId="speed">
      {getSpeedText(combat.speed)}
    </InfoRow>
  </StatSection>
);

export default CombatInfo;
