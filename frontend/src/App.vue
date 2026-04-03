<script setup lang="ts">
  import Button from './components/button.vue'
  import Render from './components/render.vue'
  import './global.css'
  import { useNavigation } from './lib/navigation'
  import Camera from './pages/camera/camera.vue'
  import Devices from './pages/devices/devices.vue'
import VideoJs from './pages/video-js/video-js.vue'
  import Video from './pages/video/video.vue'

  const navigation = useNavigation()
  const onIndex = () => navigation.transitionTo(undefined)
  const onVideo = () => navigation.transitionTo({ component: Video, props: {} })
  const onVideoJs = () => navigation.transitionTo({ component: VideoJs, props: {} })
  const onDevices = () => navigation.transitionTo({ component: Devices, props: {} })
  const onCamera = () => navigation.transitionTo({ component: Camera, props: {} })
</script>

<template>
  <div :class="$style.app">
    <div :class="$style.header">
      <Button label="Index" :on-click="onIndex" />
      <Button label="Video" :on-click="onVideo" />
      <Button label="Video.js" :on-click="onVideoJs" />
      <Button label="Devices" :on-click="onDevices" />
      <Button label="Camera" :on-click="onCamera" />
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
