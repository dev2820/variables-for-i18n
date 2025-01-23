import EventType from '@/shared/event-type';
import { PointerEvent, useState } from 'react';

export const useResizeCorner = () => {
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    target.setPointerCapture(e.pointerId);
    setIsResizing(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!isResizing) {
      return;
    }
    const size = {
      w: Math.max(50, Math.floor(e.clientX + 5)),
      h: Math.max(50, Math.floor(e.clientY + 5)),
    };
    parent.postMessage(
      { pluginMessage: { type: EventType.ResizeWindow, size: size } },
      '*',
    );
  };

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    target.releasePointerCapture(e.pointerId);
    setIsResizing(false);
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
};
