<script setup lang="ts">
  import Content from './content.vue';
  import { useLoop } from './use-loop';

  const loop = useLoop();
</script>

<template>
  <div :class="$style.loop">
    <template v-if="loop.isLoaded.value">
      <Content :loop />
    </template>
    <template v-else>
      <div :class="$style.loading">Loading…</div>
    </template>
  </div>
</template>

<style module lang="postcss">
  .loop {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #000;
  }
</style>
