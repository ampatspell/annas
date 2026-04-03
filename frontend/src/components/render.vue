<script setup lang="ts">
  import type { ComponentWithProps } from '@/lib/component';

  const { model = undefined } = defineProps<{ model?: ComponentWithProps }>();
</script>

<template>
  <component :is="model?.component" v-bind="model?.props" />
</template>
