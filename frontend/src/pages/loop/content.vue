<script setup lang="ts">
  import type { UsedLoop } from './use-loop';

  defineProps<{ loop: UsedLoop }>();

  // append all videos
  // show only current, play
</script>

<template>
  <div :class="$style.content"></div>
</template>

<style module lang="postcss">
  .content {
  }
</style>
