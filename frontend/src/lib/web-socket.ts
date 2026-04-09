import { inject, onMounted, onUnmounted, type InjectionKey, type Plugin } from "vue";
import { WEBSOCKET_URL } from "./url";
import { buildWebsocket } from "./utils";

export type Message = {
  type: "gpio";
  pin: "Left" | "Right";
};

type Subscription = { onMessage: (message: Message) => void };

const createWebsocket = () => {
  let subscriptions: Subscription[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEvent = (e: MessageEvent<any>) => {
    const json = JSON.parse(e.data);
    subscriptions.forEach((subscription) => {
      try {
        subscription.onMessage(json);
      } catch (err) {
        console.log(err);
      }
    });
  };

  const build = () => {
    return buildWebsocket({
      onEvent,
      onError,
      url: WEBSOCKET_URL,
    });
  };

  const onError = (ws: WebSocket) => {
    if (current === ws) {
      current = build();
    }
  };

  let current = build();

  const subscribe = (opts: { onMessage: (message: Message) => void }) => {
    onMounted(() => {
      subscriptions = [...subscriptions, opts];
    });
    onUnmounted(() => {
      subscriptions = subscriptions.filter((s) => s !== opts);
    });
  };

  return {
    subscribe,
  };
};

export type UsedWebsocket = ReturnType<typeof createWebsocket>;

const key: InjectionKey<UsedWebsocket> = Symbol("websocket");

export const createWebsocketPlugin = () => {
  const plugin: Plugin = (app) => {
    app.provide(key, createWebsocket());
  };
  return plugin;
};

export const useWebsocket = () => {
  return inject(key)!;
};
