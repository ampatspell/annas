import { computed, inject, ref, shallowRef, type InjectionKey, type Plugin } from "vue";

const createCamera = () => {
  const stream = ref<MediaStream>();
  const error = ref<unknown>();

  const load = async () => {
    try {
      const value = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      stream.value = value;
    } catch (err) {
      console.log(err);
      error.value = err;
    }
  };

  load();

  return {
    stream,
    error,
  };
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
