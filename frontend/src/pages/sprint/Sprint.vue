<template>
  <section id="template" class="page">
    <button @click="goToState(PageState.mainMenu)">Go to Menu</button>
    <button @click="startGame()">Retry</button>
    <div>
      <p>{{formattedCurrentTime}}</p>
      <p>{{bubblesCleared}}/{{bubbleClearToWin}}</p>
      <p>{{bubblesLeftToClear}}</p>
      <p>{{bubblesShot}} BPS: {{bubblesPerSecond}}</p>
    </div>
    <Game />
    <div>
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
import { setupSprintGame, startGame } from '@/ts/gameplay/gameplay.game-master';
import { goToState } from '@/ts/page/page.page-manager';
import { PageState } from '@/ts/page/page.e-page-state';
import { bubbleClearToWin, bubblesCleared, bubblesLeftToClear, bubblesPerSecond, bubblesShot, formattedCurrentTime } from '@/ts/gameplay/gameplay.stat-tracker';

export default {
  name: 'SprintPage',
  components: { Game },
  setup() {
    setupSprintGame();

    bubbleClearToWin

    return {
      formattedCurrentTime,
      bubbleClearToWin,
      bubblesCleared,
      bubblesLeftToClear,
      bubblesShot,
      bubblesPerSecond,
      goToState,
      PageState,
      startGame
    };
  },
};
</script>

<style></style>
