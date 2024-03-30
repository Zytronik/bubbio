<template>
  <section id="multiMenu" class="page menu">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="page-container">
        <div v-if="!hasMatchFound" class="page-dashboard ranked-dashboard">
          <div class="left-content">
            <div v-if="playerStats">
              <p>Current Elo: <span>{{ playerStats.rating }}</span></p>
              <p>Rating Deviation: <span>+/-{{ playerStats.ratingDeviation }}</span></p>
              <p>Global Rank: <span>#{{ playerStats.globalRank }}</span></p>
              <p>Games Won: <span>{{ playerStats.gamesWon }}/{{ playerStats.gamesCount }}</span></p>
              <p>Percentile: <span>{{ playerStats.percentile }}%</span></p>
              <p>Rank: <span class="rank-letter">{{ playerStats.rank }}</span></p>
            </div>
            <br><br>
            <p>Player in Queue: <span>{{ playersInQueue }}</span></p>
            <p>Players in Ranked Games: <span>0</span></p>

            <div class="matchmakingButton" @click="toggleQueue" :class="{ 'in-queue': isInQueue }">
              <div v-if="isInQueue">
                <p>Leave Queue | </p>
                <p>Passed Time: {{ passedTime }}s</p>
              </div>
              <div v-else>Enter Queue</div>
            </div>
          </div>

          <div class="right-content">
            <div class="l-tab-buttons">
              <button class="l-tab-button" v-for="tab in leaderboardTabs" :key="tab"
                :class="{ active: currentLeaderboard === tab }" @click="currentLeaderboard = tab">
                <span>{{ tab }}</span>
                <span v-if="tab === 'National' && userData?.countryCode">
                  ({{ userData.countryCode }})
                </span>
              </button>
            </div>
            <div v-if="currentLeaderboard === 'Global'" class="l-tab global-tab">
              <Leaderboard :gameMode="GameMode.Ranked" :fields="['rank', 'rating']"
                :sortBy="'rating'" :sortDirection="SortDirection.Desc"
                :leaderboardCategory="LeaderboardCategory.Global" :limit="30" />
            </div>
            <div v-if="currentLeaderboard === 'National'" class="l-tab national-tab">
              <Leaderboard :gameMode="GameMode.Ranked" :fields="['rank', 'rating']"
                :sortBy="'rating'" :sortDirection="SortDirection.Desc"
                :leaderboardCategory="LeaderboardCategory.National" :limit="30" />
            </div>
          </div>

        </div>

        <div v-if="hasMatchFound">
          <VsScreen />
        </div>

      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { onMounted, onUnmounted, ref } from 'vue';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import state from '@/ts/networking/networking.client-websocket';
import VsScreen from './components/VsScreen.vue';
import { httpClient } from '@/ts/networking/networking.http-client';
import Leaderboard from '@/globalComponents/Leaderboard.vue';
import { GameMode, LeaderboardCategory, SortDirection } from '@/ts/page/e/page.e-leaderboard';
import { UserData } from '@/ts/page/i/page.i.user-data';
import eventBus from '@/ts/page/page.event-bus';

interface PlayerMatchmakingStats {
  rating: number;
  ratingDeviation: number;
  globalRank: number;
  gamesWon: number;
  gamesCount: number;
  percentile: number;
  rank: string;
}

export default {
  name: 'RankedPage',
  components: { MenuBackButtons, VsScreen, Leaderboard },
  data() {
    return {
      currentLeaderboard: 'Global',
      leaderboardTabs: ['Global', 'National'],
    };
  },
  setup() {
    const backButtonData = ref([
      { pageState: PAGE_STATE.multiMenu, iconSrc: require('@/img/icons/ranked.png'), disabled: false },
      { pageState: PAGE_STATE.roomListing, iconSrc: require('@/img/icons/rooms.png'), disabled: true },
    ]);
    const isInQueue = ref<boolean>(false);
    const playerStats = ref<PlayerMatchmakingStats | null>(null);
    const playersInQueue = ref<number>(0);
    const passedTime = ref<number>(0);
    const userData: UserData | null = eventBus.getUserData();
    const hasMatchFound = ref<boolean>(false);
    let passedTimeInterval: ReturnType<typeof setInterval> | undefined = 0;

    function toggleQueue() {
      if (isInQueue.value) {
        leaveQueue();
      } else {
        enterQueue();
      }
      isInQueue.value = !isInQueue.value;
    }

    function leaveQueue() {
      if (state.socket) {
        stopPassedTimeCountdown();
        state.socket.emit('leaveQueue');
      }
    }

    function enterQueue() {
      if (state.socket) {
        startPassedTimeCountdown();
        state.socket.emit('enterQueue');
      }
    }

    function startPassedTimeCountdown() {
      if (passedTimeInterval) {
        stopPassedTimeCountdown();
      }
      passedTimeInterval = setInterval(() => {
        passedTime.value += 1;
      }, 1000);
    }

    function stopPassedTimeCountdown() {
      clearInterval(passedTimeInterval);
      passedTime.value = 0;
    }

    async function fetchPlayerMmStats() {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const response = await httpClient.get("/users/matchmaking/stats", {
          headers: headers
        });
        playerStats.value = response.data;
      } catch (error) {
        console.error('Failed to fetch player stats', error);
      }
    }

    function matchFound() {
      isInQueue.value = false;
      stopPassedTimeCountdown();
      hasMatchFound.value = true;
    }

    function mountSockets() {
      if (state.socket) {
        state.socket.emit('playerJoinedMmVue');

        state.socket.on('matchFound', () => {
          matchFound();
        });

        state.socket.on('queueSize', (size: number) => {
          playersInQueue.value = size;
        });
      }
    }

    function unmountSockets() {
      leaveQueue();
      if (state.socket) {
        state.socket.emit('playerLeftMmVue');
        state.socket.off('matchFound');
        state.socket.off('queueSize');
      }
    }

    onMounted(() => {
      changeBackgroundTo('linear-gradient(45deg, rgba(126,10,41,1) 0%, rgba(144,141,58,1) 100%)');
      fetchPlayerMmStats();
      mountSockets();
    });

    onUnmounted(() => {
      unmountSockets();
      stopPassedTimeCountdown();
    });

    return {
      goToState,
      PAGE_STATE,
      backButtonData,
      changeBackgroundTo,
      toggleQueue,
      isInQueue,
      playerStats,
      playersInQueue,
      passedTime,
      hasMatchFound,
      GameMode,
      SortDirection,
      LeaderboardCategory,
      userData,
    }
  }
};
</script>

<style scoped>
.back-buttons::before {
  background: linear-gradient(45deg, rgba(43, 221, 185, 1) 0%, rgba(198, 63, 119, 1) 100%);
}

.matchmakingButton {
  font-size: 30px;
  padding: 10px;
  cursor: pointer;
  background-color: grey;
  text-align: center;
}

.in-queue {
  background-color: #f00;
  color: #fff;
}

p {
  margin: unset;
}


</style>