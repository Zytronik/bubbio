<template>
  <p>Hello There</p>
  <div>
    <button v-for="entry in allSpectationEntries" :key="entry.clientID" @click="spectatePlayer(entry.clientID)">
      {{ entry.playerName }}
    </button>
    <span v-if="allSpectationEntries.length === 0">No players to spectate.</span>
  </div>
</template>

<script lang="ts">
import { joinSpectatorRoom, leaveSpectatorRoom, spectatePlayer } from '@/ts/game/network/game.network.spectate';
import { defineComponent, onMounted, onUnmounted, watch } from 'vue';
import { allSpectationEntries } from "@/ts/game/spectate/spectate.spectator";

export default defineComponent({
  name: 'SpectateTab',
  setup() {
    watch(() => allSpectationEntries, (newVal, oldVal) => {
    console.log('allSpectationEntries changed:', newVal);
  });

    onMounted(() => {
      joinSpectatorRoom();
    });

    onUnmounted(() => {
      leaveSpectatorRoom();
    });

    return {
      allSpectationEntries,
      spectatePlayer,
    };
  },
});
</script>

<style scoped></style>