<template>
  <div class="scrollable">
    <h1>Network Evaluation</h1>
    <span>Total Mismatches: {{ evaluationData.totalMismatches }}</span><br>
    <span>Total Matches: {{ evaluationData.totalMatches }}</span><br>
    <span>{{ evaluationData.inputErrors.value }}</span>
    <br><br>
    <h2 @click="toggleInput">Input History</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Input</th>
          <th>Angle</th>
          <th>Frame Time</th>
          <th>Garbage Amount</th>
        </tr>
      </thead>
      <tbody v-show="showInput">
        <tr v-for="input in inputHistory" :key="input.indexID" class="row">
          <td>{{ input.indexID }}</td>
          <td>{{ input.input }}</td>
          <td>{{ input.angle }}</td>
          <td>{{ input.frameTime }}</td>
          <td>{{ input.garbageAmount }}</td>
        </tr>
      </tbody>
    </table>

    <h2 @click="toggleBoard">Board History</h2>
    <table>
      <thead>
        <tr>
          <th>Frame Time</th>
          <th>Board String</th>
        </tr>
      </thead>
      <tbody v-show="showBoard">
        <tr
          v-for="boardFrame in boardHistory"
          :key="boardFrame.indexID"
          class="row"
        >
          <td>{{ boardFrame.frameTime }}</td>
          <td>{{ boardFrame.boardState }}</td>
        </tr>
      </tbody>
    </table>

    <h2 @click="toggleBubble">Bubbles History</h2>
    <table>
      <thead>
        <tr>
          <th>Frame Time</th>
          <th>Current Bubble</th>
          <th>Held Bubble</th>
          <th>Queue Seed</th>
          <th>Garbage Seed</th>
        </tr>
      </thead>
      <tbody v-show="showBubble">
        <tr
          v-for="bubbleFrame in bubbleQueueHistory"
          :key="bubbleFrame.indexID"
          class="row"
        >
          <td>{{ bubbleFrame.frameTime }}</td>
          <td>{{ bubbleFrame.currentBubble.type }}</td>
          <td>{{ bubbleFrame.heldBubble }}</td>
          <td>{{ bubbleFrame.queueSeedState }}</td>
          <td>{{ bubbleFrame.garbageSeedState }}</td>
        </tr>
      </tbody>
    </table>

    <h2 @click="toggleAngle">Angle History</h2>
    <table>
      <thead>
        <tr>
          <th>Frame Time</th>
          <th>Angle</th>
        </tr>
      </thead>
      <tbody v-show="showAngle">
        <tr
          v-for="angleFrame in angleHistory"
          :key="angleFrame.indexID"
          class="row"
        >
          <td>{{ angleFrame.frameTime }}</td>
          <td>{{ angleFrame.angle }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { playerGameInstance } from "@/ts/game/game.master";
import { onMounted, ref } from "vue";
import { network_getNetworkEval, evaluationData } from "../../ts/game/network/game.network.game";

export default {
  name: "NetworkEvaluation",
  setup() {
    const inputHistory = playerGameInstance.gameStateHistory.inputHistory;
    const boardHistory = playerGameInstance.gameStateHistory.boardHistory;
    const bubbleQueueHistory =
      playerGameInstance.gameStateHistory.bubbleQueueHistory;
    const angleHistory = playerGameInstance.gameStateHistory.angleHistory;
    const showInput = ref(true);
    const showBoard = ref(true);
    const showBubble = ref(true);
    const showAngle = ref(true);

    const toggleInput = () => {
      showInput.value = !showInput.value;
    };
    const toggleBoard = () => {
      showBoard.value = !showBoard.value;
    };
    const toggleBubble = () => {
      showBubble.value = !showBubble.value;
    };
    const toggleAngle = () => {
      showAngle.value = !showAngle.value;
    };

    onMounted(() => {
      network_getNetworkEval();
    });

    return {
      inputHistory,
      boardHistory,
      bubbleQueueHistory,
      angleHistory,
      toggleInput,
      toggleBoard,
      toggleBubble,
      toggleAngle,
      showInput,
      showBoard,
      showBubble,
      showAngle,
      evaluationData,
    };
  },
};
</script>

<style scoped>
table {
  width: 40%;
  border-collapse: collapse;
}

.row {
  border: 1px solid rgb(255, 255, 255);
}

.collapsed {
  display: none;
}

.scrollable {
  overflow: auto;
  height: 60vh;
}
</style>
