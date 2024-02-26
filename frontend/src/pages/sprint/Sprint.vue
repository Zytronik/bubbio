<template>
  <section id="template" class="page">
    <div v-if="!isGaming && isDasboard" class="sprintDashboard">
      <button @click="goToState(PAGE_STATE.mainMenu)">Go to Menu</button><br>
      <h2>Leaderboards (TODO)</h2>
      <h2>History (TODO)</h2>
      <h2>Personal Stats (TODO)</h2>
      <button @click="showGameView()">Start Game</button>
    </div>
    <div v-if="isGaming" class="inGame">
      <button @click="startGame()">Retry</button>
      <button @click="showDashboard()">Back</button>
      <div>
        <p>{{ formattedCurrentTime }}</p>
        <p>{{ bubblesCleared }}/{{ bubbleClearToWin }}</p>
        <p>{{ bubblesLeftToClear }}</p>
        <p>{{ bubblesShot }} BPS: {{ bubblesPerSecond }}</p>
      </div>
      <Game />
    </div>
    <div v-if="!isGaming && !isDasboard" class="gameComplete">
      <button @click="showDashboard()">Back</button>
      <button @click="showGameView()">Try Again</button>
      <h2>More Stats</h2>
      <p>Bubbles Shot: 0</p>
      <p>Wallbounce Clear Count: 0</p>
      <p>Triple Clear Count: 0</p>
      <p>Quad Clear Count: 0</p>
      <p>Quint Clear Count: 0</p>
      <p>Do this for every amount of Clear bigger then 3</p>
      <p>Highest Bubble Clear Count: 0</p>
      <p>Key pressed</p>
      <p>Key per bubble</p>
      <p>Key per Second</p>
      <p>Holds</p>
      <p>Max Combo</p>
      <p>Show Handlings (aps 1, aps 2)</p>
      <p>Date & Time</p>
    </div>
  </section>
</template>

<script lang="ts">
import Game from '../game/Game.vue';
import { goToState } from '@/ts/page/page.page-manager';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';
import { ref } from 'vue';
import { leaveGame, setupSprintGame, startGame } from '@/ts/game/game.master';
import { formattedCurrentTime, bubbleClearToWin, bubblesCleared, bubblesLeftToClear, bubblesShot, bubblesPerSecond, } from '@/ts/game/visuals/game.visuals.stat-display';

export default {
  name: 'SprintPage',
  components: { Game },
  setup() {
    const isGaming = ref<boolean>(false);
    const isDasboard = ref<boolean>(true);
    setupSprintGame();

    function showGameView() {
      startGame();
      isGaming.value = true;
      isDasboard.value = false;
    }

    function showDashboard() {
      isGaming.value = false;
      isDasboard.value = true;
      leaveGame();
    }

    formattedCurrentTime

    return {
      formattedCurrentTime,
      bubbleClearToWin,
      bubblesCleared,
      bubblesLeftToClear,
      bubblesShot,
      bubblesPerSecond,
      goToState,
      PAGE_STATE,
      showGameView,
      isGaming,
      isDasboard,
      startGame,
      showDashboard
    };
  },
};
</script>

<style></style>
