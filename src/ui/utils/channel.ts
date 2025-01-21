import EventType from '../../shared/event-type';

export class Channel {
  private constructor() {}
  private static callbackMap: Partial<
    Record<keyof typeof EventType, ((payload: any) => void)[]>
  > = {};
  private static isInit = false;

  static init() {
    window.onmessage = (evt: any) => {
      const { type, payload } = evt.data.pluginMessage || {};
      const messageType = type as keyof typeof EventType;
      Channel.callbackMap[messageType]?.forEach((cb) => cb(payload));
    };
    Channel.isInit = true;
  }
  static sendMessage = (type: keyof typeof EventType, payload?: any) => {
    if (!Channel.isInit) {
      return;
    }
    parent.postMessage(
      {
        pluginMessage: {
          type: type,
          payload: payload ?? '',
        },
      },
      '*',
    );
  };
  static onMessage = (
    type: keyof typeof EventType,
    callback: (payload: any) => void,
  ) => {
    if (!Channel.isInit) {
      return () => {};
    }
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
