<script setup lang="ts">
  import { useWebsocket } from '@/lib/web-socket';
  import { ref } from 'vue';

  const show = ref(false);
  let cancel: ReturnType<typeof setTimeout>;

  const websocket = useWebsocket();
  websocket.subscribe({
    onMessage: (message) => {
      if (message.type === 'gpio' && message.pin === 'Motion') {
        clearTimeout(cancel);
        show.value = true;
        cancel = setTimeout(() => {
          show.value = false;
        }, 1000);
      }
    },
  });
</script>

<template>
  <div :class="$style.motion">
    <div v-if="show" :class="$style.state">🐹</div>
  </div>
</template>

<style module lang="postcss">
  .motion {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > .state {
      font-size: 21px;
      font-weight: 500;
    }
  }
</style>
