<template class="page" id="game">
  <div>
    <div>
      <h1>Game</h1>
      <span class="monospace">{{ playGridASCII }}</span> <br>
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
import { ref, Ref } from 'vue';
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
</style>