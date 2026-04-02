<script lang="ts">
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

  const stream = ref<MediaStream>();
  const error = ref<unknown>();

  onMounted(async () => {
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch(err) {
      console.log(err);
      error.value = err;
    }
  });
</script>

<template>
  <div :class="$style.page">
    <template v-if="error">
      {{ error }}
    </template>
    <template v-else-if="stream">
      <div :class="$style.video">
        <video ref="ref" muted autoPlay />
      </div>
    </template>
    <template v-else>
      Loading…
    </template>
  </div>
</template>

<style module lang="postcss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    > .video {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      > video {
        min-width: 100%;
        min-height: 100%;
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
      }
    }
  }
</style>
