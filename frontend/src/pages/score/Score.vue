<template>
  <section id="scorePage" class="page">
    <GameModeLayout :backButtonData="backButtonData" :gameMode="gameMode" :leaderboardFields="leaderboardFields" :leaderboardSortByField="leaderboardSortByField" />
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo } from '@/ts/page/page.page-manager';
import GameModeLayout from '@/globalComponents/gameModeLayout.vue';
import { onMounted, ref } from 'vue';
import { ButtonData } from '@/globalComponents/i/i-buttonData';
import { GameMode } from '@/ts/page/e/page.e-leaderboard';

export default {
  name: 'HighScorePage',
  components: { GameModeLayout },
  setup() {
    const backButtonData = ref<ButtonData[]>([
      { pageState: PAGE_STATE.soloMenu, iconSrc: require('@/img/icons/score.png'), disabled: false },
      { pageState: PAGE_STATE.sprintPage, iconSrc: require('@/img/icons/sprint.png'), disabled: true },
    ]);
    const gameMode = GameMode.Score;
    const leaderboardFields = ['gameDuration', 'bubblesPerSecond'];
    const leaderboardSortByField = 'gameDuration';

    onMounted(() => {
      changeBackgroundTo('linear-gradient(45deg, rgba(43,156,221,1) 0%, rgba(198,141,63,1) 100%)');
    });

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
#scorePage .back-buttons::before {
  background: linear-gradient(45deg, rgba(96, 221, 43, 1) 0%, rgba(198, 63, 135, 1) 100%);
}
</style>