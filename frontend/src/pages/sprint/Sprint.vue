<template>
  <section id="template" class="page">
    <div v-if="!isGaming && isDashboard" class="sprintDashboard">
      <button @click="goToState(PAGE_STATE.mainMenu)">Go to Menu</button><br>
      <h1>Sprint</h1>
      <h2>Leaderboards</h2>
      <ul>
        <li v-for="(entry, index) in leaderboard" :key="index">
          <span class="sp">{{ index + 1 }}. {{ entry.user.username }}</span>
          <span>Time: {{ formatTimeNumberToString(entry.sprintTime) }}</span>
          <span>Bubbles Shot: {{ entry.bubblesShot }}</span>
          <span>BPS: {{ entry.bubblesPerSecond }}</span>
          <span>Bubbles Cleared: {{ entry.bubblesCleared }}</span>
          <span>Date: {{ formatDateTime(new Date(entry.submittedAt)) }}</span>
        </li>
      </ul>
      <div v-if="!isGuest">
        <h2>History</h2>
        <ul>
          <li v-for="(record, index) in userHistory" :key="index">
            <span>Date: {{ formatDateTime(new Date(record.submittedAt)) }}</span>
            <span>Time: {{ formatTimeNumberToString(record.sprintTime) }}</span>
            <span>Bubbles Shot: {{ record.bubblesShot }}</span>
            <span>BPS: {{ record.bubblesPerSecond }}</span>
            <span>Bubbles Cleared: {{ record.bubblesCleared }}</span>
          </li>
        </ul>
      </div>
      <div v-if="!isGuest">
        <h2>Personal Stats</h2>
        <h3>Top 3 Runs</h3>
        <ul>
          <li v-for="(record, index) in personalBests" :key="index">
            <span>{{ index + 1 }}.</span>
            <span>Time: {{ formatTimeNumberToString(record.sprintTime) }}</span>
            <span>Bubbles Shot: {{ record.bubblesShot }}</span>
            <span>BPS: {{ record.bubblesPerSecond }}</span>
            <span>Bubbles Cleared: {{ record.bubblesCleared }}</span>
            <span>Date: {{ formatDateTime(new Date(record.submittedAt)) }}</span>
          </li>
        </ul>
      </div>
      <h4 v-if="isGuest"><br>Log in for Stats and Submit Scores.</h4>
      <div v-if="isLoading" class="loading-animation">
        Loading...
      </div>

      <button @click="showGameView()">Start Game</button>
    </div>
    <div v-if="isGaming" class="inGame">
      <button @click="startGame()">Retry</button>
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
  </section>
</template>

<script lang="ts">
import Game from '../game/Game.vue';
import { setupSprintGame, startGame, leaveGame } from '@/ts/gameplay/gameplay.game-master';
import { goToState } from '@/ts/page/page.page-manager';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';
import { bubbleClearToWin, bubblesCleared, bubblesLeftToClear, bubblesPerSecond, bubblesShot, formatTimeNumberToString, formattedCurrentTime } from '@/ts/gameplay/gameplay.stat-tracker';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { httpClient } from '@/ts/networking/networking.http-client';

interface LeaderboardEntry extends GameRecord {
  user: {
    username: string;
  };
  userId: number;
}

interface GameRecord {
  submittedAt: Date | string;
  bubblesCleared: number;
  bubblesPerSecond: number;
  bubblesShot: number;
  sprintTime: number;
}

/* interface DashboardData {
  leaderboard: LeaderboardEntry[];
  userHistory: GameRecord[];
  personalBests: GameRecord[];
} */

export default {
  name: 'SprintPage',
  components: { Game },
  setup() {
    const isGaming = ref<boolean>(false);
    const isDashboard = ref<boolean>(true);
    const intervalId = ref(0);
    const userHistory = ref<GameRecord[]>([]);
    const personalBests = ref<GameRecord[]>([]);
    const leaderboard = ref<LeaderboardEntry[]>([]);
    const isLoading = ref<boolean>(true);
    const isGuestString = sessionStorage.getItem('isGuest');
    const isGuest = Boolean(isGuestString && isGuestString.toLowerCase() === 'true');

    setupSprintGame();

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

    function formatDateTime(date: Date): string {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0!
      const year = date.getFullYear().toString().substr(-2); // Get last two digits of year
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    async function fetchUserHistory() {
      const token = localStorage.getItem('authToken');
      if (!isGuest) {
        const response = await httpClient.get('/sprint/userHistory', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        userHistory.value = response.data;
      }
    }

    async function fetchPersonalBests() {
      const token = localStorage.getItem('authToken');
      if(!isGuest){
        const response = await httpClient.get('/sprint/personalBests', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        personalBests.value = response.data;
      }
    }

    async function fetchLeaderboard() {
      const response = await httpClient.get<LeaderboardEntry[]>('/sprint/leaderboard');
      leaderboard.value = response.data;
    }

    async function fetchSprintData() {
      isLoading.value = true;
      try {
        await fetchUserHistory();
        await fetchPersonalBests();
        await fetchLeaderboard();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        isLoading.value = false;
      }
    }

    function startDataFetchInterval() {
      if (!isGaming.value && isDashboard.value) {
        clearInterval(intervalId.value);
        fetchSprintData();

        intervalId.value = setInterval(() => {
          fetchSprintData();
        }, 20000); // Fetch data every 20 seconds
      } else {
        clearInterval(intervalId.value);
      }
    }

    watch([isGaming, isDashboard], () => {
      startDataFetchInterval();
    });


    onMounted(() => {
      startDataFetchInterval();
    });

    onUnmounted(() => {
      clearInterval(intervalId.value);
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
      userHistory,
      leaderboard,
      personalBests,
      formatDateTime,
      formatTimeNumberToString,
      isLoading,
      isGuest,
    };
  },
};
</script>

<style>
ul {
  list-style-type: none;
}

.loading-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 100;
  font-size: 20px;
  color: white;
}

ul li span {
  text-align: left;
  display: block;
}

ul li {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2%;
}

ul li span.sp {
  min-width: 5%;
}
</style>
