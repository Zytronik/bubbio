<template>
  <section id="replay" class="page">
    <div class="page-wrapper">
      <div class="page-container">
        <p>ReplayId: {{ replayId }}</p>
        <button @click="playReplay">Play Replay</button>
        <Game :playerGameVisuals="gameVisuals" :areRef="false" :gameMode="GameMode.Sprint" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { GameStateHistory } from '@/ts/game/i/game.i.game-state-history';
import { GameVisuals, getEmptyGameVisuals } from '@/ts/game/visuals/i/game.visuals.i.game-visuals';
import { httpClient } from '@/ts/networking/networking.http-client';
import { GameMode } from '@/ts/page/e/page.e-leaderboard';
import { addGameViewStyles, removeGameViewStyles } from '@/ts/page/page.css-transitions';
import { onMounted, onUnmounted, ref } from 'vue';
import Game from '@/pages/game/Game.vue';

export default {
  name: 'ReplayPage',
  components: { Game },
  setup() {
    const replayId = ref<number | null>(null);
    const replayData = ref<GameStateHistory | null>(null);
    const gameVisuals = ref<GameVisuals>(getEmptyGameVisuals());

    function extractReplayIdFromURL(): number | null {
      const urlPath = window.location.pathname;
      const match = urlPath.match(/\/replay\/(\d+)$/);
      if (match && match[1]) {
        return parseInt(match[1]);
      }
      return null;
    }

    async function getReplayData(replayId: number | null) {
      if (replayId) {
        const token = localStorage.getItem('authToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        try {
          const response = await httpClient.get(`/sprint/replay/${replayId}`, {
            headers: headers,
          });
          if (response.data) {
            return response.data;
          }
          return null;
        } catch (error) {
          console.error("Failed to fetch sprint replay.");
          return null;
        }
      }
    }

    async function playReplay() {
      if (replayData.value) {
        let startTime = Date.now();

        const playFrame = () => {
          if (!replayData.value || !gameVisuals.value) {
            return;
          }

          const elapsedTime = Date.now() - startTime;

          const currentInputFrame = replayData.value.inputHistory.find(
            frame => frame.frameTime <= elapsedTime
          );

          const currentBoardFrame = replayData.value.boardHistory.find(
            frame => frame.frameTime <= elapsedTime
          );

          //do stuff here i guess

          if (elapsedTime < replayData.value.inputHistory[replayData.value.inputHistory.length - 1].frameTime) {
            requestAnimationFrame(playFrame);
          }
        }

        requestAnimationFrame(playFrame);
      }
    }

    onMounted(async () => {
      addGameViewStyles();
      replayId.value = extractReplayIdFromURL();
      replayData.value = await getReplayData(replayId.value);
    });

    onUnmounted(() => {
      removeGameViewStyles();
    });

    return {
      replayId,
      GameMode,
      gameVisuals,
      playReplay,
    };
  },
};
</script>

<style scoped>
</style>
