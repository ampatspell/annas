<script setup lang="ts">
  import { guidFor } from '@/lib/guid';
  import Item from './item.vue';
  import type { UsedLoop } from './use-loop';

  defineProps<{ loop: UsedLoop }>();
</script>

<template>
  <div :class="$style.content">
    <template v-for="video in loop.all.value" :key="guidFor(video)">
      <Item :video :isCurrent="video === loop.video.value" />
    </template>
  </div>
</template>

<style module lang="postcss">
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    cursor: none;
  }
</style>
