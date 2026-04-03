<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import Button from './components/button.vue';
  import Render from './components/render.vue';
  import './global.css';
  import { useNavigation } from './lib/navigation';
  import Camera from './pages/camera/camera.vue';
  import Devices from './pages/devices/devices.vue';
  import Video from './pages/video/video.vue';
  import { useEventListener } from '@vueuse/core';
  import { useFullscreen } from '@vueuse/core';
  import Loop from './pages/loop/loop.vue';

  const navigation = useNavigation();
  const onLoop = () => navigation.transitionTo({ component: Loop, props: {} });
  const onVideo = () => navigation.transitionTo({ component: Video, props: {} });
  const onDevices = () => navigation.transitionTo({ component: Devices, props: {} });
  const onCamera = () => navigation.transitionTo({ component: Camera, props: {} });

  const contentRef = useTemplateRef('contentRef');
  const { toggle } = useFullscreen();
  useEventListener(contentRef, 'dblclick', () => {
    toggle();
  });
</script>

<template>
  <div :class="$style.app">
    <div :class="$style.header">
      <Button label="Loop" :on-click="onLoop" />
      <Button label="Video" :on-click="onVideo" />
      <Button label="Devices" :on-click="onDevices" />
      <Button label="Camera" :on-click="onCamera" />
    </div>
    <div :class="$style.content" ref="contentRef">
      <Render :model="navigation.page.value" />
    </div>
  </div>
</template>

<style module lang="postcss">
  .app {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    > .header {
      position: absolute;
      padding: 10px;
      display: flex;
      flex-direction: row;
      gap: 8px;
      z-index: 1;
      background: rgba(255, 255, 255, 0.1);
      border-bottom-right-radius: 4px;
    }
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
