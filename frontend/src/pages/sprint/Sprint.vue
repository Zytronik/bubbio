<template>
  <section id="template" class="page">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="page-container">

        <div v-if="!isGaming && isDashboard" class="sprintDashboard">
          <Leaderboard
          :gameMode="GameMode.Sprint"
          :fields="['gameDuration', 'bubblesShot', 'bubblesPerSecond', 'bubblesCleared', 'submittedAt']"
          :sortBy="'gameDuration'"
          :sortDirection="SortDirection.Asc"
          :leaderboardCategory="LeaderboardCategory.Global"
          :limit="10"/>

          <div v-if="!isGuest">
            <History 
            :gameMode="GameMode.Sprint"
            :fields="['gameDuration', 'bubblesShot', 'bubblesPerSecond', 'bubblesCleared', 'submittedAt']"
            :sortBy="'submittedAt'"
            :sortDirection="SortDirection.Desc"
            :limit="10" />
            <h3>Personal Best</h3>
            <ul>
              <li v-for="(record, index) in personalBests" :key="index">
                <span>{{ index + 1 }}.</span>
                <span>Time: {{ formatTimeNumberToString(record.gameDuration) }}</span>
                <span>Bubbles Shot: {{ record.bubblesShot }}</span>
                <span>BPS: {{ record.bubblesPerSecond }}</span>
                <span>Bubbles Cleared: {{ record.bubblesCleared }}</span>
                <span>Date: {{ formatDateTime(new Date(record.submittedAt)) }}</span>
              </li>
            </ul>
          </div>
          
          <h4 v-if="isGuest"><br>Log in for Stats and Submit Scores.</h4>
          <button @click="showGameView()">Start Game</button>
        </div>

        <div v-if="isGaming" class="inGame">
          <button @click="showDashboard()">Back</button>
          <div>
            <p>{{ formattedCurrentTime }}</p>
            <p>{{ bubblesCleared }}/{{ bubbleClearToWin }}</p>
            <p>{{ bubblesLeftToClear }}</p>
            <p>{{ bubblesShot }} BPS: {{ bubblesPerSecond }}</p>
          </div>
          <Game />
        </div>

        <div v-if="!isGaming && !isDashboard" class="gameComplete">
          <button @click="showDashboard()">Back</button>
          <button @click="showGameView()">Try Again</button>
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

      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Game from '../game/Game.vue';
import { changeBackgroundTo, formatDateTime, goToState } from '@/ts/page/page.page-manager';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';
import { onMounted, ref } from 'vue';
import { httpClient } from '@/ts/networking/networking.http-client';
import { leaveGame, setupSprintGame, startGame } from '@/ts/game/game.master';
import { bubbleClearToWin, bubblesCleared, bubblesLeftToClear, bubblesPerSecond, bubblesShot, formatTimeNumberToString, formattedCurrentTime } from '@/ts/game/visuals/game.visuals.stat-display';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import Leaderboard from '@/globalComponents/Leaderboard.vue';
import History from '@/globalComponents/History.vue';
import { GameMode, LeaderboardCategory, SortDirection } from '@/ts/page/page.e-leaderboard';
import { backInput } from '@/ts/input/input.possible-inputs';
import { enableBackInputs } from '@/ts/input/input.input-manager';

interface GameRecord {
  submittedAt: Date | string;
  bubblesCleared: number;
  bubblesPerSecond: number;
  bubblesShot: number;
  gameDuration: number;
}

export default {
  name: 'SprintPage',
  components: { Game, MenuBackButtons, Leaderboard, History },
  setup() {
    const isGaming = ref<boolean>(false);
    const isDashboard = ref<boolean>(true);
    const personalBests = ref<GameRecord[]>([]);
    const isGuestString = sessionStorage.getItem('isGuest');
    const isGuest = Boolean(isGuestString && isGuestString.toLowerCase() === 'true');
    const backButtonData = ref([
      { pageState: PAGE_STATE.soloMenu, iconSrc: require('@/img/icons/sprint.png'), disabled: false },
    ]);

    setupSprintGame();
    backInput.fire = showDashboard;
    enableBackInputs();

    function showGameView() {
      startGame();
      isGaming.value = true;
      isDashboard.value = false;
    }

    async function showDashboard() {
      isGaming.value = false;
      isDashboard.value = true;
      leaveGame();
    }

    async function fetchPersonalBests() {
      const token = localStorage.getItem('authToken');
      if (!isGuest) {
        const response = await httpClient.get('/sprint/personalBest', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        personalBests.value = response.data;
      }
    }

    async function fetchSprintData() {
      try {
        await fetchPersonalBests();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    onMounted(() => {
      changeBackgroundTo('linear-gradient(45deg, rgba(43,156,221,1) 0%, rgba(198,141,63,1) 100%)');
      fetchSprintData();
    });

    return {
      formattedCurrentTime,
      bubbleClearToWin,
      bubblesCleared,
      bubblesLeftToClear,
      bubblesShot,
      bubblesPerSecond,
      goToState,
      PAGE_STATE,
      showGameView,
      isGaming,
      isDashboard,
      startGame,
      showDashboard,
      personalBests,
      formatDateTime,
      formatTimeNumberToString,
      isGuest,
      backButtonData,
      changeBackgroundTo,
      GameMode,
      LeaderboardCategory,
      SortDirection,
    };
  },
};
</script>

<style scoped>
.back-buttons::before {
  background: linear-gradient(45deg, rgba(96, 221, 43, 1) 0%, rgba(198, 63, 135, 1) 100%);
}

ul {
  list-style-type: none;
  padding: unset;
}

ul li span {
  text-align: left;
  display: block;
}

ul li {
  display: flex;
  flex-direction: row;
  gap: 2%;
}

ul li span.sp {
  min-width: 5%;
}

.inGame,
.inGame>div {
  text-align: center;
}
</style>
