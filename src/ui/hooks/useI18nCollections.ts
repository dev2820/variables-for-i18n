import { useEffect, useState } from 'react';
import { Channel } from '../utils/channel';
import EventType from '../../shared/event-type';
import { Collection } from '@/shared/types/collection';

export const useI18nCollections = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    setIsLoaded(false);
    const removeListeners = [];
    removeListeners.push(
      Channel.onMessage(EventType.ResponseLoadCollectionData, (payload) => {
        const data = payload as Collection[];
        setCollections(data);
        setIsLoaded(true);
      }),
    );

    Channel.sendMessage(EventType.RequestLoadCollectionData);

    return () => {
      removeListeners.forEach((l) => l());
    };
  }, []);

  return {
    isLoaded,
    collections,
  };
};
