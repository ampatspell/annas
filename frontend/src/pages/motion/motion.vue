<script setup lang="ts">
  import { useWebsocket } from '@/lib/web-socket';
  import { ref } from 'vue';

  const show = ref(false);

  const websocket = useWebsocket();
  websocket.subscribe({
    onMessage: (message) => {
      if (message.type === 'gpio') {
        if (message.pin === 'MotionUp') {
          show.value = true;
        } else if (message.pin === 'MotionDown') {
          show.value = false;
        }
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
      font-size: 100px;
      font-weight: 500;
    }
  }
</style>
