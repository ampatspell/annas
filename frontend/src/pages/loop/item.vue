<script setup lang="ts">
  import { useTemplateRef, watch } from 'vue';
  import type { LoopVideo } from './use-loop';

  const props = defineProps<{ video: LoopVideo; isCurrent: boolean }>();

  const itemRef = useTemplateRef('itemRef');

  let inserted: HTMLElement | undefined;
  watch(
    [() => props.video, itemRef],
    ([next, item]) => {
      if (inserted) {
        inserted.remove();
      }
      if (next && item) {
        const el = next.element;
        item.appendChild(el);
        inserted = el;
      }
    },
    { immediate: true },
  );
</script>

<template>
  <div ref="itemRef" :class="[$style.item, isCurrent && $style.current]"></div>
</template>

<style module lang="postcss">
  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    display: none;
    > video {
      min-width: 100%;
      min-height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
    &.current {
      display: block;
    }
  }
</style>
