<template class="page" id="game">
  <div class="gameUI-wrapper">
    <span class="monospace" v-html="areRef ? playerGameVisuals.asciiBoard.incomingGarbage.value : playerGameVisuals.asciiBoard.incomingGarbage"></span>
    <span class="monospace" v-html="areRef ? playerGameVisuals.asciiBoard.holdString.value : playerGameVisuals.asciiBoard.holdString"></span>
    <span class="monospace remove-whiteSpaces" v-html="areRef ? playerGameVisuals.asciiBoard.queueString.value : playerGameVisuals.asciiBoard.queueString"></span>
    <span class="monospace text-center" v-html="areRef ? playerGameVisuals.asciiBoard.playGridASCII.value : playerGameVisuals.asciiBoard.playGridASCII"></span>
    <span class="monospace overlap-infos" v-html="areRef ? playerGameVisuals.asciiBoard.floatingText.value : playerGameVisuals.asciiBoard.floatingText"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GamePage',
  props: {
    playerGameVisuals: {
      type: Object,
      required: true,
    },
    areRef: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
});

</script>

<style scoped>
</style>