<script setup lang="ts">
  import { useTemplateRef, watch } from 'vue';
  import type { LoopVideo } from './use-loop';

  const props = defineProps<{ video: LoopVideo; isCurrent: boolean }>();

  const itemRef = useTemplateRef('itemRef');

  let inserted: HTMLElement | undefined;
  watch(
    [() => props.video, itemRef, () => props.isCurrent],
    ([next, item, isCurrent]) => {
      if (inserted) {
        inserted.remove();
      }
      if (next && item && isCurrent) {
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
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
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
