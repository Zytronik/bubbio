<template>
  <section id="sprintPage" class="page">
    <GameModeLayout :backButtonData="backButtonData" :gameMode="gameMode" :leaderboardFields="leaderboardFields" :leaderboardSortByField="leaderboardSortByField" />
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { ref } from 'vue';
import GameModeLayout from '@/globalComponents/gameModeLayout.vue';
import { GameMode } from '@/ts/page/e/page.e-leaderboard';

export default {
  name: 'SprintPage',
  components: { GameModeLayout },
  setup() {
    const backButtonData = ref([
      { pageState: PAGE_STATE.soloMenu, iconSrc: require('@/img/icons/sprint.png'), disabled: false },
      { pageState: PAGE_STATE.scorePage, iconSrc: require('@/img/icons/score.png'), disabled: true },
    ]);
    const gameMode = GameMode.Sprint;
    const leaderboardFields = ['gameDuration', 'bubblesPerSecond'];
    const leaderboardSortByField = 'gameDuration';

    return {
      backButtonData,
      gameMode,
      leaderboardFields,
      leaderboardSortByField,
    };
  },
};
</script>

<style></style>@/ts/constant/page.e-leaderboard@/ts/constant/page.e-page-state