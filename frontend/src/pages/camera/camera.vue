<script setup lang="ts">
  import { useCamera } from '@/lib/camera';
  import { useTemplateRef, watchEffect } from 'vue';

  const camera = useCamera();
  const pageRef = useTemplateRef('pageRef');

  watchEffect(() => {
    if (pageRef.value) {
      pageRef.value.appendChild(camera.element);
    }
  });
</script>

<template>
  <div :class="$style.page" ref="pageRef"></div>
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
        transform: scaleX(-1);
      }
    }
  }
</style>
