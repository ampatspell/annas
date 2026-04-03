<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  const devices = ref<MediaDeviceInfo[]>()

  onMounted(async () => {
    devices.value = await navigator.mediaDevices.enumerateDevices()
  })
</script>

<template>
  <div :class="$style.page">
    <template v-if="devices === undefined"> Loading… </template>
    <template v-else>
      <template v-for="device in devices" :key="device.deviceId">
        <div class="row">
          {{ device.kind }} {{ device.label }} {{ device.deviceId }} {{ device.deviceId }}
        </div>
      </template>
    </template>
  </div>
</template>

<style module lang="postcss">
  .page {
    padding: 10px;
  }
</style>
