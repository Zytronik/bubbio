<template class="page" id="game">
  <div class="gameUI-wrapper">
    <span class="monospace" v-html="incomingGarbage"></span>
    <span class="monospace" v-html="playGridASCII"></span>
  </div>
</template>

<script lang="ts">
import { incomingGarbage, playGridASCII } from '@/ts/game/visuals/game.visuals.ascii';

export default {
  name: 'GamePage',
  setup() {
    return {
      playGridASCII,
      incomingGarbage,
    }
  },
}
</script>

<style scoped>
.monospace {
  white-space: pre-line;
  font-family: 'Consolas', monospace;
  font-size: 20px;
}

.gameUI-wrapper{
  display: flex;
  flex-direction: column;
  min-width: 390px;
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