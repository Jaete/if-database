'use client';

import { type ISenses } from '@/db/creatures/creatures.d';
import StatSection from '@/components/StatSection';
import InfoRow from '@/components/InfoRow';

interface IProps {
  senses: ISenses;
}

const SensesBlock = ({ senses }: IProps) => (
  <StatSection title="Sentidos">
    <InfoRow label="Percepção passiva:" valueId="sense-perception">
      {senses.passivePerception ?? '---'}
    </InfoRow>
    {senses.darkvision != null && senses.darkvision > 0 && (
      <InfoRow label="Visão no escuro:" valueId="sense-darkvision">
        {senses.darkvision} m
      </InfoRow>
    )}
    {senses.blindsight != null && senses.blindsight > 0 && (
      <InfoRow label="Visão às cegas:" valueId="sense-blindsight">
        {senses.blindsight} m
      </InfoRow>
    )}
    {senses.tremorsense != null && senses.tremorsense > 0 && (
      <InfoRow label="Percepção sísmica:" valueId="sense-tremorsense">
        {senses.tremorsense} m
      </InfoRow>
    )}
    {senses.truesight != null && senses.truesight > 0 && (
      <InfoRow label="Visão verdadeira:" valueId="sense-truesight">
        {senses.truesight} m
      </InfoRow>
    )}
  </StatSection>
);

export default SensesBlock;
