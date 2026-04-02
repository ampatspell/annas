<script setup lang="ts">
  import { ComponentWithProps } from './component';

  const { model = undefined } = defineProps<{ model?: ComponentWithProps }>();
</script>

<template>
  <component :is="model?.component" v-bind="model?.props" />
</template>
