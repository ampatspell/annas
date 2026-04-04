import { useCamera, type UsedCamera } from "@/lib/camera";
import { useVideos } from "@/lib/videos";
import { useWebsocket } from "@/lib/web-socket";
import { onKeyStroke } from "@vueuse/core";
import { computed, shallowRef, watch } from "vue";

const rnd = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const createVideo = (opts: { name: string; url: string }) => {
  const { name } = opts;
  const element = document.createElement("video");
  element.src = opts.url;

  return { type: "video" as const, name, element };
};

const createCamera = (camera: UsedCamera) => {
  const stream = computed(() => camera.stream.value);
  const element = document.createElement("video");

  watch(stream, (stream) => {
    if (stream) {
      element.srcObject = stream;
    }
  });

  return { type: "camera" as const, element };
};

export type LoopVideo = ReturnType<typeof createVideo> | ReturnType<typeof createCamera>;

const createVideos = () => {
  const videos = useVideos();
  const camera = useCamera();

  const all = computed(() => {
    return [
      ...videos.index.value.map((name) => {
        return createVideo({ name, url: videos.urlFor(name) });
      }),
      createCamera(camera),
    ];
  });

  const isLoaded = computed(() => videos.isLoaded.value);

  return {
    isLoaded,
    all,
  };
};

export const useLoop = () => {
  const websocket = useWebsocket();

  const videos = createVideos();

  websocket.subscribe({
    onMessage: (message) => {
      console.log(message);
    },
  });

  const isLoaded = computed(() => videos.isLoaded.value);

  const video = shallowRef<LoopVideo>();

  const prev = () => {};

  const next = () => {
    const index = rnd(0, videos.all.value.length);
    const next = videos.all.value[index]!;
    if (next) {
      console.log(next);
      video.value = next;
    }
  };

  onKeyStroke("ArrowLeft", () => prev());
  onKeyStroke("ArrowRight", () => next());

  watch(videos.all, (all) => {
    if (all.length) {
      next();
    }
  });

  return {
    isLoaded,
    video,
  };
};

export type UsedLoop = ReturnType<typeof useLoop>;
