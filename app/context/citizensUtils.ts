'use client';

import ICitizen from '@/db/citizens/citizen.d';
import { createEntityUtils } from './createEntityUtils';

// Mantido como fachada porque o nome já é importado em outros pontos; o corpo
// agora vem da fábrica compartilhada.
const api = createEntityUtils<ICitizen>({
  basePath: '/api/citizens',
  label: 'cidadão',
});

export const fetchCitizens = api.fetchAll;
export const createCitizen = api.create;
export const updateCitizen = api.update;
export const deleteCitizen = api.remove;
