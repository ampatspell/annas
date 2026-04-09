<script setup lang="ts">
  import { useVideos } from '@/lib/videos';
  import { ref } from 'vue';

  const videos = useVideos();
  const id = ref<string>();
</script>

<template>
  <div :class="$style.videos">
    <div :class="$style.header">
      <template v-if="videos.isLoaded.value">
        <template v-for="video in videos.index.value" :key="video">
          <div :class="[$style.video, video === id && $style.selected]" @click="() => (id = video)">
            {{ video }}
          </div>
        </template>
      </template>
      <template v-else-if="videos.isError.value">
        {{ videos.error.value }}
      </template>
      <template v-else> Loading… </template>
    </div>
    <div :class="$style.content">
      <template v-if="id">
        <div :class="$style.video">
          <video :src="videos.urlFor(id)" autoplay="true" />
        </div>
      </template>
    </div>
  </div>
</template>

<style module lang="postcss">
  .videos {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    > .header {
      position: absolute;
      top: 40px;
      left: 0;
      padding: 10px;
      display: flex;
      flex-direction: row;
      gap: 4px;
      background: rgba(0, 0, 0, 0.1);
      color: #fff;
      z-index: 1;
      > .video {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        &.selected {
          font-weight: 600;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    }
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      > .video {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        > video {
          min-width: 100%;
          min-height: 100%;
          max-width: 100%;
          max-height: 100%;
          object-fit: cover;
        }
      }
    }
  }
</style>
