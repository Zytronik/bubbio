<template class="page" id="game">
  <div>
    <div>
      <h1>Game</h1>
      <span>queue: {{ queue }}</span> <br>
      <span>currentBubble: {{ currentBubble }}</span> <br>
      <span>holdBubble: {{ holdBubble }}</span> <br>
      <span>board: {{ board }}</span> <br>
      <span>currentCombo: {{ currentCombo }}</span> <br>
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
import { socket } from '../../../networking/clientWebsocket';
import { ref, Ref, onMounted } from 'vue';

export default {
  name: 'GamePage',
  setup() {
    let queue: Ref<string> = ref("bro\nbroo");
    let currentBubble: Ref<string> = ref("nice");
    let holdBubble: Ref<string> = ref("meme");
    let board: Ref<string> = ref("haha");
    let angle: Ref<number> = ref(90);
    let currentCombo: Ref<string> = ref("for christmas");

    let sentPackages: Ref<string> = ref("");
    let receivedPackages: Ref<string> = ref("");

    onMounted(() => {
      console.log('Vue app mounted | game');
      socket.on('generateQueue', (data: any) => {
        console.log(data);
      });
    });

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
