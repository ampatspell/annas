<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{ type?: 'regular' | 'fill'; label?: string; onClick?: () => void }>();
  const type = computed(() => props.type ?? 'regular');
</script>

<template>
  <button :class="[$style.button, $style[`type-${type}`]]" @click="onClick">
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else>
      {{ label }}
    </template>
  </button>
</template>

<style module lang="postcss">
  .button {
    user-select: none;
    appearance: none;
    outline: none;
    border: none;
    background: #333;
    color: #fff;
    font-family: 'Ubuntu Mono', monospace;
    font-size: 14px;
    width: 100%;
    font-weight: 600;
    line-height: 14px;
    padding: 5px 8px;
    border-radius: 3px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    gap: 8px;
    transition: 0.15s ease-in-out opacity;
    &.type-regular {
      max-width: max-content;
    }
    &.type-fill {
      width: 100%;
    }
    &.disabled {
      opacity: 0.25;
    }
  }
</style>
