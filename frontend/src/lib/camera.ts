import JMuxer from "jmuxer";
import { inject, type InjectionKey, type Plugin } from "vue";
import { WEBCAM_URL } from "./url";
import { buildWebsocket } from "./utils";

const createCamera = () => {
  const element = document.createElement("video");
  element.autoplay = true;
  element.muted = true;

  const jmuxer = new JMuxer({
    node: element,
    mode: "video",
    flushingTime: 0,
    fps: 30,
    debug: false,
  });

  const build = () => {
    return buildWebsocket({
      onEvent,
      onError,
      url: WEBCAM_URL,
      binaryType: "arraybuffer",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEvent = (e: MessageEvent<any>) => {
    const video = new Uint8Array(e.data);
    jmuxer.feed({
      video,
    });
  };

  const onError = (ws: WebSocket) => {
    if (ws === current) {
      current = build();
    }
  };

  let current = build();

  return { element };
};

export type UsedCamera = ReturnType<typeof createCamera>;

const key: InjectionKey<UsedCamera> = Symbol("camera");

export const createCameraPlugin = () => {
  const plugin: Plugin = (app) => {
    app.provide(key, createCamera());
  };
  return plugin;
};

export const useCamera = () => {
  return inject(key)!;
};
