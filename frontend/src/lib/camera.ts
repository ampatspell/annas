import JMuxer from "jmuxer";
import { inject, type InjectionKey, type Plugin } from "vue";
import { WEBCAM_URL } from "./url";

const createCamera = () => {
  const element = document.createElement("video");
  element.autoplay = true;
  element.muted = true;

  const jmuxer = new JMuxer({
    node: "stream",
    mode: "video",
    flushingTime: 0,
    fps: 30,
    debug: false,
  });

  const ws = new WebSocket(WEBCAM_URL);
  ws.binaryType = "arraybuffer";
  ws.addEventListener("message", (e) => {
    const video = new Uint8Array(e.data);
    jmuxer.feed({
      video,
    });
  });

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
