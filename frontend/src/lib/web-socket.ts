import { inject, onMounted, onUnmounted, type InjectionKey, type Plugin } from "vue";
import { WEBSOCKET_URL } from "./url";

export type Message = {
  type: "gpio";
  pin: "Left" | "Right";
};

type Subscription = { onMessage: (message: Message) => void };

export const buildWebsocket = (opts: {
  url: string;
  binaryType?: BinaryType;
  onEvent: (e: MessageEvent<unknown>) => void;
  onError: (ws: WebSocket) => void;
}) => {
  const websocket = new WebSocket(opts.url);
  if (opts.binaryType) {
    websocket.binaryType = opts.binaryType;
  }

  const open = () => {
    console.log("ws: opened");
  };
  const close = (e: Event) => {
    console.log("ws: close", e);
    onError();
  };
  const error = (e: Event) => {
    console.log("ws: error", e);
    onError();
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const message = (e: MessageEvent<any>) => {
    // console.log("ws: message", e.data);
    opts.onEvent(e);
  };
  const onError = async () => {
    websocket.removeEventListener("open", open);
    websocket.removeEventListener("close", close);
    websocket.removeEventListener("error", error);
    websocket.removeEventListener("message", message);
    clearInterval(cancel);
    opts.onError(websocket);
  };
  websocket.addEventListener("open", open);
  websocket.addEventListener("close", close);
  websocket.addEventListener("error", error);
  websocket.addEventListener("message", message);

  const cancel = setInterval(() => {
    if (websocket.readyState == websocket.OPEN) {
      websocket.send("ping");
    }
  }, 3000);

  return websocket;
};

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
    return buildWebsocket({ onEvent, onError, url: WEBSOCKET_URL });
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
