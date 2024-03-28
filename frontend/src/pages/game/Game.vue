<template class="page" id="game">
  <div class="gameUI-wrapper">
    <span class="monospace" v-html="playerGameVisuals.asciiBoard.queueString.value"></span>
    <span class="monospace" v-html="playerGameVisuals.asciiBoard.holdString.value"></span>
    <span class="monospace" v-html="playerGameVisuals.asciiBoard.incomingGarbage.value"></span>
    <span class="monospace text-center" v-html="playerGameVisuals.asciiBoard.playGridASCII.value"></span>
    <span class="monospace" v-html="playerGameVisuals.asciiBoard.floatingText.value"></span>
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
.monospace {
  white-space: pre-line;
  font-family: 'Consolas', monospace;
}

.gameUI-wrapper{
  display: flex;
  flex-direction: column;
}

html body {
  margin: 0;
  padding: 0;
  border: 0;
  background-color: black;
}

#vue {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  margin-top: 60px;
}

</style>