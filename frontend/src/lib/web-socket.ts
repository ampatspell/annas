import { computed, inject, ref, shallowRef, type InjectionKey, type Plugin } from "vue";

const createWebsocket = () => {
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
    console.log("ws: message", e);
  });

  return {};
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
