<template class="page" id="game">
  <div class="gameUI-wrapper">
    <span class="monospace" v-html="playerGameVisuals.asciiBoard.incomingGarbage.value"></span>
    <span class="monospace" v-html="playerGameVisuals.asciiBoard.holdString.value"></span>
    <span class="monospace remove-whiteSpaces" v-html="playerGameVisuals.asciiBoard.queueString.value"></span>
    <span class="monospace text-center" v-html="playerGameVisuals.asciiBoard.playGridASCII.value"></span>
    <span class="monospace overlap-infos" v-html="playerGameVisuals.asciiBoard.floatingText.value"></span>
  </div>
</template>

<script lang="ts">
import { playerGameVisuals } from '@/ts/game/game.master';

export default {
  name: 'GamePage',
  setup() {
    return {
      playerGameVisuals,
    }
  },
}
</script>

<style scoped>
</style>