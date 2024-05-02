<template>
  <section id="pixitesting" class="page">
    <div class="page-wrapper">
      <div class="page-container">
        <div id="pixicanvas">
          <button @click="goToState(PAGE_STATE.soloMenu)">go Back</button>
          <button @click="openCanvasAsImageInNewTab">open canvas in new tab</button>
        </div>
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
#pixicanvas {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  background: gray;
}
</style>