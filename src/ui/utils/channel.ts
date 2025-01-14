import EventType from '../../shared/event-type';

export class Channel {
  private constructor() {}
  private static callbackMap: Partial<
    Record<keyof typeof EventType, ((payload: any) => void)[]>
  > = {};
  static init() {
    window.onmessage = (evt) => {
      const { type, payload } = evt.data.pluginMessage || {};
      const messageType = type as keyof typeof EventType;
      Channel.callbackMap[messageType]?.forEach((cb) => cb(payload));
    };
  }
  static sendMessage = (type: keyof typeof EventType, payload: any) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: type,
          payload: payload,
        },
      },
      '*',
    );
  };
  static onMessage = (
    type: keyof typeof EventType,
    callback: (payload: any) => void,
  ) => {
    if (Channel.callbackMap?.[type] === undefined) {
      Channel.callbackMap[type] = [];
    }

    Channel.callbackMap[type].push(callback);

    return () => {
      Channel.callbackMap[type] = Channel.callbackMap[type].filter(
        (cb) => cb !== callback,
      );
    };
  };
}
