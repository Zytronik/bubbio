<template>
  <section id="pixitesting" class="page">
    <div class="page-wrapper">
      <div class="page-container">
        <div id="pixicanvas">
          <div>
          <button @click="goToState(PAGE_STATE.soloMenu)">go Back</button>
          <button @click="openCanvasAsImageInNewTab">open canvas in new tab</button>
        </div>
        <div>
            <button @click="showBubbleSpriteSheet">Bubbles</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { addGameViewStyles, removeGameViewStyles } from '@/ts/page/page.css-transitions';
import { appendExportCanvas, openCanvasAsImageInNewTab, showBubbleSpriteSheet } from '@/ts/asset/asset.pixi-visuals-export';

export default defineComponent({
  name: 'PixiCanvas',
  setup() {
    onMounted(() => {
      changeBackgroundTo("black");
      addGameViewStyles();
      appendExportCanvas();
    });

    onUnmounted(() => {
      removeGameViewStyles();
    });

    return {
      showBubbleSpriteSheet,
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