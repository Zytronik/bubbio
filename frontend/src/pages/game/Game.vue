<template class="page" id="game">
  <div>
    <span class="monospace" v-html="playGridASCII"></span> <br>
    <span>angle: {{ angle }}</span> <br>
    <input type="range" v-model="angle" min="0" max="180" step="1">
  </div>
</template>

<script lang="ts">
import { onUnmounted } from 'vue';
import { leaveGame } from '@/ts/game/game.master';
import { playGridASCII } from '@/ts/game/visuals/game.logic.visuals.ascii';
import { angle } from '@/ts/game/logic/game.logic.angle';

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
      angle,
    }
  },
}

</script>

<style>
.monospace {
  white-space: pre-line;
  font-family: 'Consolas', monospace;
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

section.page {
  max-width: 80%;
  margin: 0 auto;
  padding: 0 15px;
}
</style>@/ts/game/visuals/game.visuals.ascii