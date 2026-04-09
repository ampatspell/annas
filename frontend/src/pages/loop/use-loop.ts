import { useCamera, type UsedCamera } from "@/lib/camera";
import { rnd } from "@/lib/utils";
import { useVideos } from "@/lib/videos";
import { useWebsocket } from "@/lib/web-socket";
import { onKeyStroke } from "@vueuse/core";
import { computed, shallowRef, watch } from "vue";

const createVideo = (opts: { name: string; url: string; onEnded: () => void }) => {
  const { name } = opts;
  const element = document.createElement("video");
  element.volume = 1;

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
  element.style = 'transform: rotate(180deg)';

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
  const history: LoopVideo[] = [];
  let index = 0;

  const play = (next: LoopVideo) => {
    video.value?.pause();
    video.value = next;
    next.play();
  };

  const pick = (except?: LoopVideo) => {
    let i = 0;
    while (i < 5) {
      const index = rnd(0, all.value.length);
      const video = all.value[index];
      if (video && video !== except) {
        return video;
      }
      i++;
    }
  };

  const next = () => {
    let video = history[index + 1];
    if (video) {
      play(video);
      index++;
    } else {
      video = pick(history[index]);
      if (video) {
        play(video);
        history.push(video);
        index++;
      }
    }
  };

  const prev = () => {
    let video = history[index - 1];
    if (video) {
      play(video);
      index--;
    } else {
      video = pick(history[index]);
      if (video) {
        play(video);
        history.unshift(video);
      }
    }
  };

  onKeyStroke("ArrowLeft", () => prev());
  onKeyStroke("ArrowRight", () => next());

  watch(all, (all) => {
    if (all.length) {
      const video = pick()!;
      play(video);
      history.push(video);
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
