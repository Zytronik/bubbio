<template>
  <div v-if="!isSpectating">
    <button v-for="entry in allSpectationEntries" :key="entry.clientID"
      @click="spectatePlayer(entry.clientID); showSpectatedGame();">
      {{ entry.playerName }}
    </button>
    <span v-if="allSpectationEntries.length === 0">No players to spectate.</span>
  </div>
  <div v-if="isSpectating">
    <button @click="showSpectationEntries();">Switch back to old view</button>
    <div v-for="[playerName, visuals] in playerNameVisualsMap" :key="playerName">
      <span>{{ playerName }}</span>
      <br>
      <p>{{ visuals.statNumbers.formattedCurrentTime }}</p>
      <p>Bubbles Cleared: {{ visuals.statNumbers.bubblesCleared }}/{{ visuals.statNumbers.bubbleClearToWin }}</p>
      <p>Bubbles Shot: {{ visuals.statNumbers.bubblesShot }} BPS: {{ visuals.statNumbers.bubblesPerSecond }}</p>
      <div class="gameUI-wrapper">
        <span class="monospace" v-html="visuals.asciiBoard.incomingGarbage"></span>
        <span class="monospace" v-html="visuals.asciiBoard.holdString"></span>
        <span class="monospace remove-whiteSpaces" v-html="visuals.asciiBoard.queueString"></span>
        <span class="monospace text-center" v-html="visuals.asciiBoard.playGridASCII"></span>
        <span class="monospace overlap-infos" v-html="visuals.asciiBoard.floatingText"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { network_joinSpectatorRoom, network_leaveSpectatorRoom, network_spectatePlayer, network_stopSpectating } from '@/ts/game/network/game.network.spectate';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { allSpectationEntries, playerNameVisualsMap, startSpectatorStatDisplay, stopSpectatorStatDisplay } from "@/ts/game/spectate/spectate.spectator";

export default defineComponent({
  name: 'SpectateTab',
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
</style>