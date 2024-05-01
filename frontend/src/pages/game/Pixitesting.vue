<template>
  <section id="pixitesting" class="page">
    <div class="page-wrapper">
      <div class="page-container" id="pixicanvas">
        <button @click="goToState(PAGE_STATE.soloMenu)">go Back</button>
        <button @click="openCanvasAsImageInNewTab">open canvas in new tab</button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { appendPixiCanvas, setupPixiAssets, openCanvasAsImageInNewTab } from '@/ts/game/visuals/game.visuals.pixi';
import { addGameViewStyles, removeGameViewStyles } from '@/ts/page/page.css-transitions';

export default defineComponent({
  name: 'PixiCanvas',
  setup() {
    onMounted(() => {
      changeBackgroundTo("black");
      addGameViewStyles();
      setupPixiAssets().then(() => {
        appendPixiCanvas();
      });
    });

    onUnmounted(() => {
      removeGameViewStyles();
    });

    return {
      openCanvasAsImageInNewTab,
      goToState,
      PAGE_STATE,
    }
  }
});
</script>

<style scoped>
.back-buttons::before {
  background: linear-gradient(45deg, rgba(96, 221, 43, 1) 0%, rgba(198, 63, 135, 1) 100%);
}
</style>