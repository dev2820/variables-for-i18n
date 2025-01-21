import { useEffect, useState } from 'react';
import { Channel } from '../utils/channel';
import type { Mode } from '../../shared/types/mode';
import EventType from '../../shared/event-type';

export const useI18nVariables = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [modes, setModes] = useState<Mode[]>([]);
  const [vars, setVars] = useState<Variable[]>([]);

  useEffect(() => {
    setIsLoaded(false);
    const removeListeners = [];
    removeListeners.push(
      Channel.onMessage(EventType.UpdateVariableData, (payload) => {
        const data = payload as { modes: Mode[]; vars: Variable[] };
        setModes(data.modes);
        setVars(data.vars);
        setIsLoaded(true);
      }),
    );

    Channel.sendMessage(EventType.RequestLoadVariableData);

    return () => {
      removeListeners.forEach((l) => l());
    };
  }, []);

  return {
    isLoaded,
    modes,
    vars,
  };
};
