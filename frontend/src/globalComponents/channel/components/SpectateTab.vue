<template>
  <div v-if="!isSpectating">
    <button v-for="entry in allSpectationEntries" :key="entry.clientID"
      @click="spectatePlayer(entry.clientID); showSpectatedGame();">
      {{ entry.playerName }}
    </button>
    <span v-if="allSpectationEntries.length === 0">No players to spectate.</span>
  </div>
  <div class="spectating" v-if="isSpectating">
    <button @click="showSpectationEntries();">Switch back to old view</button>
    <div class="game" v-for="[playerName, visuals] in playerNameVisualsMap" :key="playerName">

      <div class="game-wrapper">
        <div class="inGameStats">
          <p>{{ visuals.statNumbers.formattedCurrentTime }}</p>
          <p>{{ visuals.statNumbers.bubblesCleared }}/{{ visuals.statNumbers.bubbleClearToWin }}</p>
          <p>{{ visuals.statNumbers.bubblesShot }} BPS: {{ visuals.statNumbers.bubblesPerSecond }}</p>
        </div>
        <Game :playerGameVisuals="visuals" :areRef="false"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { network_joinSpectatorRoom, network_leaveSpectatorRoom, network_spectatePlayer, network_stopSpectating } from '@/ts/game/network/game.network.spectate';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { allSpectationEntries, playerNameVisualsMap, startSpectatorStatDisplay, stopSpectatorStatDisplay } from "@/ts/game/spectate/spectate.spectator";
import Game from '@/pages/game/Game.vue';

export default defineComponent({
  name: 'SpectateTab',
  components: {Game},
  setup() {
    const isSpectating = ref(false);

    function showSpectatedGame() {
      isSpectating.value = true;
      startSpectatorStatDisplay();
    }

    function showSpectationEntries() {
      isSpectating.value = false;
      stopSpectatorStatDisplay();
      network_stopSpectating();
    }

    onMounted(() => {
      network_joinSpectatorRoom();
    });

    onUnmounted(() => {
      network_leaveSpectatorRoom();
      network_stopSpectating();
      stopSpectatorStatDisplay();
    });

    return {
      allSpectationEntries,
      spectatePlayer: network_spectatePlayer,
      isSpectating,
      showSpectatedGame,
      showSpectationEntries,
      playerNameVisualsMap,
    };
  },
});
</script>

<style scoped>
.game {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-bottom: 5%;
  box-sizing: border-box;
}

.spectating {
  height: 100%;
}

.game-wrapper {
  font-size: 130%;
}
</style>