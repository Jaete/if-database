'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { RaceChoiceStep } from '@/services/raceTraits.service';
import RacePicker from './RacePicker';

/**
 * Quem abre o seletor de raça: a placa de Status, a linha de cima da ficha e a
 * lista de Habilidades. Um provedor só mantém um modal só, e cada um pede para
 * abri-lo (no passo que falta, se for o caso) sem saber onde ele vive.
 *
 * Local ao organismo de propósito, como o EditingContext.
 */
interface IRacePickerContext {
  open: (step?: RaceChoiceStep) => void;
}

const RacePickerContext = createContext<IRacePickerContext>({
  open: () => {},
});

export const useRacePicker = () => useContext(RacePickerContext);

export const RacePickerProvider = ({ children }: { children: ReactNode }) => {
  // O corpo do modal só existe enquanto ele está aberto (ver RacePicker), então
  // o rascunho do seletor nasce da ficha de agora a cada abertura, sem um
  // efeito de reset.
  const [state, setState] = useState<{ step?: RaceChoiceStep } | null>(null);

  return (
    <RacePickerContext.Provider value={{ open: (step) => setState({ step }) }}>
      {children}
      <RacePicker
        isOpen={state !== null}
        initialStep={state?.step}
        onClose={() => setState(null)}
      />
    </RacePickerContext.Provider>
  );
};
