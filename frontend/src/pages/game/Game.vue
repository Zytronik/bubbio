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
import { APS } from '@/ts/game-settings/game-settings.handling';
import { InputReader } from '@/ts/input/input.input-reader';
import { leftInput } from '@/ts/input/input.possible-inputs';
import { socket } from '@/ts/networking/networking.client-websocket';
import { ref, Ref, onMounted } from 'vue';

export default {
  name: 'GamePage',
  setup() {
    let queue: Ref<string> = ref("bro\nbroo");
    let currentBubble: Ref<string> = ref("nice");
    let holdBubble: Ref<string> = ref("meme");
    let board: Ref<string> = ref("haha");
    let angle: Ref<number> = ref(90);
    let currentCombo: Ref<string> = ref("abc");

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

    function left(): void {
      let timePassed = performance.now() - leftInput.lastFiredAtTime
      let leftAmount = APS.value * timePassed
      angle.value = cleanUpAngle(angle.value - leftAmount);
    }

    function cleanUpAngle(angle: number): number {
      if (angle < 0) {
        return 0;
      }
      else if (angle > 180) {
        return 180;
      } 
      else {
        return Number(angle.toFixed(1));
      }
    }

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


let inputReader = new InputReader();
let inputReader2 = new InputReader();

</script>

<style></style>
@/settings/input/inputReader@/gameSettings/input/inputReader../../../ts/networking/clientWebsocket