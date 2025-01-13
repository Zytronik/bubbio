<template>
  <section id="scorePage" class="page">
    <GameModeLayout :backButtonData="backButtonData" :gameMode="gameMode" :leaderboardFields="leaderboardFields" :leaderboardSortByField="leaderboardSortByField" />
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import GameModeLayout from '@/globalComponents/gameModeLayout.vue';
import { ref } from 'vue';
import { BackButtonData } from '@/globalComponents/i/i-buttonData';
import { GameMode } from '@/ts/page/e/page.e-leaderboard';

export default {
  name: 'HighScorePage',
  components: { GameModeLayout },
  setup() {
    const backButtonData = ref<BackButtonData[]>([
      { pageState: PAGE_STATE.sprintPage, iconSrc: require('@/img/icons/sprint.png'), disabled: true },
      { pageState: PAGE_STATE.soloMenu, iconSrc: require('@/img/icons/score.png'), disabled: false },
    ]);
    const gameMode = GameMode.Score;
    const leaderboardFields = ['gameDuration', 'bubblesPerSecond'];
    const leaderboardSortByField = 'gameDuration';

    return {
      backButtonData,
      PAGE_STATE,
      gameMode,
      leaderboardFields,
      leaderboardSortByField,
    };
  },
};
</script>

<style>
</style>