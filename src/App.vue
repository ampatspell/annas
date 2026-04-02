<script setup lang="ts">
import { onMounted, ref } from 'vue';

// import { invoke } from "@tauri-apps/api/core";

  const devices = ref<MediaDeviceInfo[]>();

  onMounted(async () => {
    devices.value = await navigator.mediaDevices.enumerateDevices();
  });

</script>

<template>
  <main class="container">
    <template v-if="devices === undefined">
      Loading…
    </template>
    <template v-else>
      <template v-for="device in devices" :key="device.deviceId">
        <div class="row">{{ device.kind }} {{ device.label }} {{ device.deviceId }} {{ device.deviceId }}</div>
      </template>
    </template>
  </main>
</template>

<style module lang="postcss">
</style>
