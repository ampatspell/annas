<script setup lang="ts">
  import { guidFor } from '@/lib/guid';
  import Item from './item.vue';
  import type { UsedLoop } from './use-loop';
  import { computed, watch } from 'vue';
  import { mins } from '@/lib/utils';

  const props = defineProps<{ loop: UsedLoop }>();

  const current = computed(() => props.loop.video.value);

  let cancel: Parameters<typeof clearTimeout>[0] | undefined;
  watch(current, (video) => {
    clearTimeout(cancel);
    if (video?.type === 'camera') {
      cancel = setTimeout(() => {
        props.loop.next();
      }, mins(1));
    }
  });
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
