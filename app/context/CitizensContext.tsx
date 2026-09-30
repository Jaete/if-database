'use client';

import ICitizen from '@/db/citizens/citizen.d';
import { createEntityContext } from './createEntityContext';

const entity = createEntityContext<ICitizen>({
  basePath: '/api/citizens',
  label: 'cidadão',
  providerName: 'CitizensProvider',
});

export const CitizensContext = entity.Context;

interface IProps {
  children: React.ReactNode;
  initialCitizens?: ICitizen[];
}

export default function CitizensProvider({
  children,
  initialCitizens,
}: IProps) {
  return (
    <entity.Provider initialItems={initialCitizens}>{children}</entity.Provider>
  );
}

interface ICitizensContext {
  citizens: ICitizen[];
  loading: boolean;
  update: (citizen: ICitizen) => Promise<ICitizen | undefined>;
  erase: (citizen: ICitizen) => Promise<void>;
  create: (citizen: ICitizen) => Promise<ICitizen | undefined>;
}

// A fábrica chama a lista de `items`; os componentes de cidadão já falam
// `citizens`, então o nome é traduzido aqui em vez de em cada chamada.
export function useCitizens(): ICitizensContext {
  const { items, loading, update, erase, create } = entity.useEntities();
  return { citizens: items, loading, update, erase, create };
}
