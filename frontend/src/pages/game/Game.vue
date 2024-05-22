<template class="page" id="game">
  <div class="game-wrapper">





    <div v-if="gameMode === 'sprint'" class="inGameStats">
      <div class="bottom">
        <div>
          <p>Time</p>
          <p
            v-html="areRef ? playerGameVisuals.statNumbers.formattedCurrentTime.value : playerGameVisuals.statNumbers.formattedCurrentTime">
          </p>
        </div>
        <div>
          <p>Cleared</p>
          <p>{{ playerGameVisuals.statNumbers.bubblesCleared }}/{{ playerGameVisuals.statNumbers.bubbleClearToWin }}
          </p>
        </div>
        <div>
          <p>Bubbles</p>
          <p>{{ playerGameVisuals.statNumbers.bubblesShot }}.</p>
          <p>{{ playerGameVisuals.statNumbers.bubblesPerSecond
            }}/S</p>
        </div>
      </div>
      <div class="top">
        <transition name="fade">
          <p
            v-if="playerGameVisuals.statNumbers.currentCombo > 0 || playerGameVisuals.statNumbers.currentCombo.value > 0">
            Combo {{
              areRef ? playerGameVisuals.statNumbers.currentCombo.value : playerGameVisuals.statNumbers.currentCombo }}
          </p>
        </transition>
        <transition name="fade">
          <p
            v-if="(areRef && playerGameVisuals.statNumbers.spikeNumber.value) || (!areRef && playerGameVisuals.statNumbers.spikeNumber)">
            Spike {{
              areRef ? playerGameVisuals.statNumbers.spikeNumber.value : playerGameVisuals.statNumbers.spikeNumber }}</p>
        </transition>
      </div>
    </div>







    <div v-if="gameMode === 'ranked'" class="inGameStats">
      <div class="top">
        <transition name="fade">
          <p v-if="playerGameVisuals.statNumbers.currentCombo.value > 0">Combo {{
            playerGameVisuals.statNumbers.currentCombo.value }}</p>
        </transition>
        <transition name="fade">
          <p v-if="playerGameVisuals.statNumbers.spikeNumber.value">Spike {{
            playerGameVisuals.statNumbers.spikeNumber.value }}</p>
        </transition>
      </div>
      <div class="bottom">
        <div>
          <p>Time</p>
          <p
            v-html="areRef ? playerGameVisuals.statNumbers.formattedCurrentTime.value : playerGameVisuals.statNumbers.formattedCurrentTime">
          </p>
        </div>
        <div>
          <p>Attack</p>
          <p>{{ playerGameVisuals.statNumbers.attackPerMinute }} APM</p>
        </div>
        <div>
          <p>Bubbles</p>
          <p>{{ playerGameVisuals.statNumbers.bubblesShot }}.</p>
          <p>{{ playerGameVisuals.statNumbers.bubblesPerSecond
            }}/S</p>
        </div>
      </div>
    </div>






    <div class="gameUI-wrapper">
      <div class="garbage-wrapper"
        v-html="areRef ? playerGameVisuals.asciiBoard.incomingGarbage.value : playerGameVisuals.asciiBoard.incomingGarbage">
      </div>
      <p class="queue-text"><span class="text-noWhiteSpaces">Q</span><span class="text-noWhiteSpaces">ueue</span></p>
      <div class="queue-wrapper">
        <div class="queue-overflow">
          <div class="queue-pieces"
            v-html="areRef ? playerGameVisuals.asciiBoard.queueString.value : playerGameVisuals.asciiBoard.queueString">
          </div>
        </div>
      </div>
      <div class="board"
        v-html="areRef ? playerGameVisuals.asciiBoard.playGridASCII.value : playerGameVisuals.asciiBoard.playGridASCII">
      </div>
      <div class="overlap-infos"
        v-html="areRef ? playerGameVisuals.asciiBoard.floatingText.value : playerGameVisuals.asciiBoard.floatingText">
      </div>
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>