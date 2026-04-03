<script setup lang="ts">
  import { useCamera } from '@/lib/camera'
  import { computed, useTemplateRef, watchEffect } from 'vue'

  const camera = useCamera()
  const stream = computed(() => camera.stream.value)
  const error = computed(() => camera.error.value)

  const video = useTemplateRef('video')

  watchEffect(() => {
    if (video.value && stream.value) {
      video.value.srcObject = stream.value
    }
  })
</script>

<template>
  <div :class="$style.page">
    <template v-if="error"> Error: {{ error }} </template>
    <template v-else-if="stream">
      <div :class="$style.video">
        <video ref="video" muted autoPlay />
      </div>
    </template>
    <template v-else> Loading… </template>
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
        transform: scaleX(-1);
      }
    }
  }
</style>
