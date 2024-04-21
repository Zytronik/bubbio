<template class="page" id="game">
  <div class="game-wrapper">
    <div v-if="gameMode === 'sprint'" class="inGameStats">
      <p v-html="areRef ? playerGameVisuals.statNumbers.formattedCurrentTime.value : playerGameVisuals.statNumbers.formattedCurrentTime"></p>
      <p>{{ playerGameVisuals.statNumbers.bubblesCleared }}/{{ playerGameVisuals.statNumbers.bubbleClearToWin }}
      </p>
      <p>{{ playerGameVisuals.statNumbers.bubblesShot }} BPS: {{ playerGameVisuals.statNumbers.bubblesPerSecond
        }}</p>
    </div>
    <div v-if="gameMode === 'ranked'" class="inGameStats">
      <p v-html="areRef ? playerGameVisuals.statNumbers.formattedCurrentTime.value : playerGameVisuals.statNumbers.formattedCurrentTime"></p>
      <p>{{ playerGameVisuals.statNumbers.attackPerMinute }} APM</p>
      <p>{{ playerGameVisuals.statNumbers.defensePerMinute }} DPM</p>
      <p>{{ playerGameVisuals.statNumbers.bubblesShot }} BPS: {{ playerGameVisuals.statNumbers.bubblesPerSecond
        }}</p>
    </div>
    <div class="gameUI-wrapper">
      <span class="monospace"
        v-html="areRef ? playerGameVisuals.asciiBoard.incomingGarbage.value : playerGameVisuals.asciiBoard.incomingGarbage"></span>
      <span class="monospace"
        v-html="areRef ? playerGameVisuals.asciiBoard.holdString.value : playerGameVisuals.asciiBoard.holdString"></span>
      <span class="monospace remove-whiteSpaces"
        v-html="areRef ? playerGameVisuals.asciiBoard.queueString.value : playerGameVisuals.asciiBoard.queueString"></span>
      <span class="monospace text-center"
        v-html="areRef ? playerGameVisuals.asciiBoard.playGridASCII.value : playerGameVisuals.asciiBoard.playGridASCII"></span>
      <span class="monospace overlap-infos"
        v-html="areRef ? playerGameVisuals.asciiBoard.floatingText.value : playerGameVisuals.asciiBoard.floatingText"></span>
      <span class="username text-center" v-html="playerGameVisuals.playerName.toUpperCase()"></span>
    </div>
  </div>

</template>

<script lang="ts">
import { GameMode } from '@/ts/page/e/page.e-leaderboard';
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  name: 'GamePage',
  props: {
    playerGameVisuals: {
      type: Object,
      required: true,
    },
    areRef: {
      type: Boolean,
      required: true,
      default: false,
    },
    gameMode: {
      type: String as PropType<GameMode>,
      required: true,
      validator: (value: string): boolean => Object.values(GameMode).includes(value as GameMode),
    },
  },
});

</script>

<style scoped></style>