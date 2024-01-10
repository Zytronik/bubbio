<template>
  <div id="game" class="page">
    <h1>Game</h1>
    <span>queue: {{ queue }}</span> <br>
    <span>currentBubble: {{ currentBubble }}</span> <br>
    <span>holdBubble: {{ holdBubble }}</span> <br>
    <span>board: {{ board }}</span> <br>
    <span>angle: {{ angle }}</span> <br>
    <span>currentCombo: {{ currentCombo }}</span> <br>
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
</template>

<script lang="ts">
import { socket } from '../../clientWebsocket.js';
import { ref, Ref, onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    let queue = ref("bro\nbroo");
    let currentBubble = ref("nice");
    let holdBubble = ref("meme");
    let board = ref("haha");
    let angle: Ref<string> = ref("all i need");
    let currentCombo = ref("for christmas");

    let sentPackages = ref("");
    let receivedPackages = ref("");

    onMounted(() => {
      console.log('Vue app mounted | game');
      socket.on('generateQueue', (data) => {
        console.log(data);
      });
    });

    socket.on('testma', (data) => {
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
