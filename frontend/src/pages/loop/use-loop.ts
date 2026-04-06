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
    element.play();
  };

  return { type: "video" as const, name, element, pause, play };
};

const createCamera = (camera: UsedCamera) => {
  const stream = computed(() => camera.stream.value);
  const element = document.createElement("video");
  element.volume = 0;

  watch(stream, (stream) => {
    if (stream) {
      element.srcObject = stream;
      element.play();
    }
  });

  const pause = () => {};
  const play = () => {};

  return { type: "camera" as const, element, pause, play };
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
        if (message.button === "Left") {
          prev();
        } else if (message.button === "Right") {
          next();
        }
      }
    },
  });

  const isLoaded = computed(() => videos.isLoaded.value);

  const video = shallowRef<LoopVideo>();

  const last: LoopVideo[] = [];

  const addLast = () => {
    if (last.length > 3) {
      last.shift();
    }
    if (video.value) {
      last.push(video.value);
    }
  };

  const play = (next: LoopVideo) => {
    console.log(next);
    video.value?.pause();
    video.value = next;
    next.play();
  };

  const pickNext = () => {
    while (true) {
      const index = rnd(0, all.value.length);
      const video = all.value[index]!;
      if (video) {
        if (!last.includes(video)) {
          return video;
        }
      } else {
        return;
      }
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
    } else {
      next();
    }
  };

  onKeyStroke("ArrowLeft", () => prev());
  onKeyStroke("ArrowRight", () => next());

  watch(all, (all) => {
    if (all.length) {
      next();
    }
  });

  return {
    isLoaded,
    video,
    all,
  };
};

export type UsedLoop = ReturnType<typeof useLoop>;
