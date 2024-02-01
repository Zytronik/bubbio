<template class="page" id="game">
  <div>
    <div>
      <span class="monospace" v-html="playGridASCII"></span> <br>
      <span>angle: {{ angle }}</span> <br>
      <input type="range" v-model="angle" min="0" max="180" step="1">
    </div>
    <hr>
    <div>
      <span>sentPackages: </span>
      <p>{{ sentPackages }}</p>
    </div>
    <hr>
    <div>
      <span>receivedPackages: </span>
      <p>{{ receivedPackages }}</p>
    </div>
    <hr>
    <div>
      <button @click="testma">testma</button>
    </div>
  </div>
</template>

<script lang="ts">
import { InputReader } from '@/ts/input/input.input-reader';
import state from '@/ts/networking/networking.client-websocket';
import { onMounted, onUnmounted, ref, Ref } from 'vue';
import { angle, setupAngleControls } from '@/ts/gameplay/gameplay.angle'
import { setupGrid, playGridASCII } from '@/ts/gameplay/gameplay.playgrid';
import { setupShootControls } from '@/ts/gameplay/gameplay.shoot';

export default {
  name: 'GamePage',
  setup() {
    setupGrid();
    new InputReader();
    setupAngleControls();
    setupShootControls();

    let sentPackages: Ref<string> = ref("");
    let receivedPackages: Ref<string> = ref("");

    if (state.socket) {
      state.socket.on('testma', (data: any) => {
        receivedPackages.value += "\n" + data;
        console.log(data);
      });
    }

    const testma = () => {
      sentPackages.value += "\ntestma";
      console.log(sentPackages.value)
      if (state.socket) {
        state.socket.emit('testma', { pog: "asdf" });
      }
    };

    return {
      playGridASCII,
      angle,
      sentPackages,
      receivedPackages,
      testma
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
</style>