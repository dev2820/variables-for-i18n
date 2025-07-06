import { useEffect, useState } from 'react';
import { Channel } from '../utils/channel';
import EventType from '../../shared/event-type';

export const useUserPermission = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(false);
    const removeListeners = [];
    removeListeners.push(
      Channel.onMessage(EventType.UserPermission, (payload) => {
        const data = payload;
        console.log('data', data);
        setCanEdit(data);
        setIsLoaded(true);
      }),
    );

    Channel.sendMessage(EventType.CheckPermission);

    return () => {
      removeListeners.forEach((l) => l());
    };
  }, []);

  return {
    isLoaded,
    canEdit,
  };
};
