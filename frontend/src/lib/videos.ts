import { computed, onMounted, ref } from 'vue';

const URL = 'http://localhost:3000/videos';

export const useVideos = () => {
  const isLoaded = ref(false);
  const error = ref<unknown>();
  const isError = computed(() => !!error.value);
  const index = ref<string[]>([]);

  const loadIndex = async () => {
    try {
      const res = await fetch(URL, { method: 'GET' });
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
    return `${URL}/videos/${name}`;
  };

  return {
    isLoaded,
    isError,
    error,
    index,
    urlFor,
  };
};
