<template class="page" id="game">
  <div class="gameUI-wrapper">
    <span class="monospace" v-html="incomingGarbage"></span>
    <span class="monospace" v-html="playGridASCII"></span>
    <!-- <span>angle: {{ angle }}</span> <br> -->
  </div>
</template>

<script lang="ts">
import { onUnmounted } from 'vue';
import { leaveGame } from '@/ts/game/game.master';
import { incomingGarbage, playGridASCII } from '@/ts/game/visuals/game.visuals.ascii';

window.addEventListener('keydown', function (e) {
  if (e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});

export default {
  name: 'GamePage',
  setup() {
    onUnmounted(() => {
      leaveGame();
    })
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