import { computed, onMounted, ref } from "vue";
import { VIDEOS_URL } from "./url";

export const useVideos = () => {
  const isLoaded = ref(false);
  const error = ref<unknown>();
  const isError = computed(() => !!error.value);
  const index = ref<string[]>([]);

  const loadIndex = async () => {
    try {
      const res = await fetch(VIDEOS_URL, { method: "GET" });
      const json = await res.json();
      isLoaded.value = true;
      index.value = json;
    } catch (err) {
      error.value = err;
    }
  };

  onMounted(() => {
    error.value = undefined;
    loadIndex();
  });

  const urlFor = (name: string) => {
    return `${VIDEOS_URL}/${name}`;
  };

  return {
    isLoaded,
    isError,
    error,
    index,
    urlFor,
  };
};
