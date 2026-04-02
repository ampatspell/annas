<script setup lang="ts">
  import { onMounted } from 'vue';
  import Button from './components/button.vue';
  import Render from './components/render.vue';
  import './global.css';
  import { useNavigation } from './navigation';
  import Devices from './pages/devices/devices.vue';
  import Video from './pages/video/video.vue';
  // import { invoke } from "@tauri-apps/api/core";

  const navigation = useNavigation();
  const onIndex = () => navigation.transitionTo(undefined);
  const onDevices = () => navigation.transitionTo({ component: Devices, props: {} });
  const onVideo = () => navigation.transitionTo({ component: Video, props: {} });
</script>

<template>
  <div :class="$style.app">
    <div :class="$style.header">
      <Button label="Index" :on-click="onIndex" />
      <Button label="List devices" :on-click="onDevices" />
      <Button label="Video" :on-click="onVideo" />
    </div>
    <div :class="$style.content">
      <Render :model="navigation.page.value" />
    </div>
  </div>
</template>

<style module lang="postcss">
  .app {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .header {
      padding: 10px;
      display: flex;
      flex-direction: row;
      gap: 8px;
    }
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
