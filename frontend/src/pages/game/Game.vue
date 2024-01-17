<template class="page" id="game">
  <div>
    <div>
      <h1>Game</h1>
      <span>queue: {{ queue }}</span> <br>
      <span>currentBubble: {{ currentBubble }}</span> <br>
      <span>holdBubble: {{ holdBubble }}</span> <br>
      <span>board: {{ board }}</span> <br>
      <span>currentCombo: {{ currentCombo }}</span> <br>
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
import { socket } from '@/ts/networking/networking.client-websocket';
import { ref, Ref } from 'vue';
import { angle, setupAngleControls, getXY } from '@/ts/gameplay/gameplay.angle'

export default {
  name: 'GamePage',
  setup() {
    new InputReader();
    setupAngleControls();
    let queue: Ref<string> = ref("bro\nbroo");
    let currentBubble: Ref<string> = ref("nice");
    let holdBubble: Ref<string> = ref("meme");
    let board: Ref<string> = ref("haha");
    let currentCombo: Ref<string> = ref("abc");

    let sentPackages: Ref<string> = ref("");
    let receivedPackages: Ref<string> = ref("");

    socket.on('testma', (data: any) => {
      receivedPackages.value += "\n" + data;
      console.log(data);
    });

    const testma = () => {
      sentPackages.value += "\ntestma";
      console.log(sentPackages.value)
      socket.emit('testma', { pog: "asdf" });
    };


    return {
      queue,
      currentBubble,
      holdBubble,
      board,
      angle,
      currentCombo,
      sentPackages,
      receivedPackages,
      testma,
    };

  },
};

</script>

<style></style>