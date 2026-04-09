import { useCamera, type UsedCamera } from "@/lib/camera";
import { useVideos } from "@/lib/videos";
import { useWebsocket } from "@/lib/web-socket";
import { onKeyStroke } from "@vueuse/core";
import { computed, shallowRef, watch } from "vue";

const rnd = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const createVideo = (opts: { name: string; url: string; onEnded: () => void }) => {
  const { name } = opts;
  const element = document.createElement("video");
  element.volume = 0;

  element.addEventListener("ended", () => {
    element.currentTime = 0;
    opts.onEnded();
  });

  element.src = opts.url;

  const pause = () => {
    element.pause();
  };

  const play = () => {
    element.autoplay = true;
    element.play().catch(() => {});
  };

  return {
    type: "video" as const,
    name,
    element,
    pause,
    play,
  };
};

const createCamera = (camera: UsedCamera) => {
  const element = camera.element;

  const pause = () => {};
  const play = () => {};

  return { type: "camera" as const, name: "camera", element, pause, play };
};

export type LoopVideo = ReturnType<typeof createVideo> | ReturnType<typeof createCamera>;

const createVideos = (opts: { onEnded: () => void }) => {
  const videos = useVideos();
  const camera = useCamera();

  const all = computed(() => {
    return [
      ...videos.index.value.map((name) => {
        return createVideo({
          name,
          url: videos.urlFor(name),
          onEnded: () => opts.onEnded(),
        });
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

  const videos = createVideos({
    onEnded: () => {
      next();
    },
  });

  const all = videos.all;

  websocket.subscribe({
    onMessage: (message) => {
      if (message.type === "gpio") {
        if (message.pin === "Left") {
          prev();
        } else if (message.pin === "Right") {
          next();
        }
      }
    },
  });

  const isLoaded = computed(() => videos.isLoaded.value);

  const video = shallowRef<LoopVideo>();
  const last: LoopVideo[] = [];
  const max = 10000;

  const addLast = () => {
    if (video.value) {
      if (last.length > max) {
        last.shift();
      }
      last.push(video.value);
    }
  };

  const play = (next: LoopVideo) => {
    video.value?.pause();
    video.value = next;
    next.play();
  };

  const pickNext = () => {
    let i = 0;
    while (i < 5) {
      const index = rnd(0, all.value.length);
      const video = all.value[index];
      if (video && video !== last[last.length - 1]) {
        return video;
      }
      i++;
    }
  };

  const next = () => {
    const next = pickNext();
    if (next) {
      addLast();
      play(next);
    }
  };

  const prev = () => {
    const video = last.pop();
    if (video) {
      play(video);
    }
  };

  onKeyStroke("ArrowLeft", () => prev());
  onKeyStroke("ArrowRight", () => next());

  watch(all, (all) => {
    if (all.length) {
      last.length = 0;
      Array(max / 2)
        .fill(0)
        .forEach(() => {
          const video = pickNext();
          if (video) {
            last.push(video);
          }
        });
      next();
    }
  });

  return {
    isLoaded,
    video,
    all,
    next,
  };
};

export type UsedLoop = ReturnType<typeof useLoop>;
