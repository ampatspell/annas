import { inject, onMounted, onUnmounted, type InjectionKey, type Plugin } from "vue";

export type Message = {
  type: "gpio";
  button: "Left" | "Right";
};

type Subscription = { onMessage: (message: Message) => void };

const createWebsocket = () => {
  let subscriptions: Subscription[] = [];

  const websocket = new WebSocket("ws://127.0.0.1:3000/ws");

  websocket.addEventListener("open", () => {
    console.log("ws: opened");
  });
  websocket.addEventListener("close", () => {
    console.log("ws: close");
  });
  websocket.addEventListener("error", (e) => {
    console.log("ws: error", e);
  });
  websocket.addEventListener("message", (e) => {
    console.log("ws: message", e.data);
    subscriptions.forEach((subscription) => {
      try {
        const json = JSON.parse(e.data);
        subscription.onMessage(json);
      } catch (err) {
        console.log(err);
      }
    });
  });

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
