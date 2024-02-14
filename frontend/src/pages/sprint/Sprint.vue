<template>
  <section id="template" class="page">
    <div v-if="!isGaming && isDasboard" class="sprintDashboard">
      <button @click="goToState(PAGE_STATE.mainMenu)">Go to Menu</button><br>
      <h2>Leaderboards</h2>
      <ul>
        <li v-for="(entry, index) in leaderboard" :key="index">
          {{ index + 1 }}. {{ entry.user.username }} -
          Date: {{ formatDateTime(new Date(entry.submittedAt)) }}
          Time: {{ formatTimeNumberToString(entry.sprintTime) }}
          Bubbles Shot: {{ entry.bubblesShot }}
          BPS: {{ entry.bubblesPerSecond }}
          Bubbles Cleared: {{ entry.bubblesCleared }}
        </li>
      </ul>
      <h2>History</h2>
      <ul>
        <li v-for="(record, index) in userHistory" :key="index">
          Date: {{ formatDateTime(new Date(record.submittedAt)) }}
          Time: {{ formatTimeNumberToString(record.sprintTime) }}
          Bubbles Shot: {{ record.bubblesShot }}
          BPS: {{ record.bubblesPerSecond }}
          Bubbles Cleared: {{ record.bubblesCleared }}
        </li>
      </ul>
      <h2>Personal Stats</h2>
      <h3>Top 3 Runs</h3>
      <ul>
        <li v-for="(record, index) in personalBests" :key="index">
          {{ index + 1 }}.
          Date: {{ formatDateTime(new Date(record.submittedAt)) }}
          Time: {{ formatTimeNumberToString(record.sprintTime) }}
          Bubbles Shot: {{ record.bubblesShot }}
          BPS: {{ record.bubblesPerSecond }}
          Bubbles Cleared: {{ record.bubblesCleared }}
        </li>
      </ul>      
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
    <div v-if="!isGaming && !isDasboard" class="gameComplete">
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
import { onMounted, ref } from 'vue';
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
    const isDasboard = ref<boolean>(true);
    const userHistory = ref<GameRecord[]>([]);
    const personalBests = ref<GameRecord[]>([]);
    const leaderboard = ref<LeaderboardEntry[]>([]);

    setupSprintGame();

    function showGameView() {
      startGame();
      isGaming.value = true;
      isDasboard.value = false;
    }

    async function showDashboard() {
      isGaming.value = false;
      isDasboard.value = true;
      await fetchSprintData();
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
      const response = await httpClient.get('/sprint/userHistory', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      userHistory.value = response.data;
    }

    async function fetchPersonalBests() {
      const token = localStorage.getItem('authToken');
      const response = await httpClient.get('/sprint/personalBests', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      personalBests.value = response.data;
    }

    async function fetchLeaderboard() {
      const token = localStorage.getItem('authToken');
      const response = await httpClient.get<LeaderboardEntry[]>('/sprint/leaderboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      leaderboard.value = response.data;
    }

    async function fetchSprintData(){
      await fetchUserHistory();
      await fetchPersonalBests();
      await fetchLeaderboard();
    }

    onMounted(async () => {
      await fetchSprintData();
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
      isDasboard,
      startGame,
      showDashboard,
      userHistory,
      leaderboard,
      personalBests,
      formatDateTime,
      formatTimeNumberToString,
    };
  },
};
</script>

<style>
ul {
  list-style-type: none;
}
</style>
