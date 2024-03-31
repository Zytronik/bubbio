<template>
  <section id="multiMenu" class="page menu">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="page-container">
        <div v-if="!hasMatchFound" class="page-dashboard ranked-dashboard">
          <div class="left-content">

            <div class="playerStats" v-if="playerStats">
              <div>
                <p class="rank">#{{ playerStats.globalRank }}</p>
                <p class="rating">Elo {{ playerStats.rating }}<span>±{{ playerStats.ratingDeviation }}</span></p>
              </div>
              <p>Games won: {{ playerStats.gamesWon }}/{{ playerStats.gamesCount }}</p>
            </div>
            
            <div v-if="playerStats && playerStats.rankInfo.prevRank && playerStats.rankInfo.nextRank"
              class="progressBarWrapper">
              <div class="prevRank">
                <p>{{ playerStats.rankInfo.prevRank.percentile }}%</p>
                <p class="rank-letter">{{ playerStats.rankInfo.prevRank.ascii }}</p>
              </div>
              <div class="progress">
                <div class="currentRank">
                  <p>{{ playerStats.percentile }}%</p>
                  <p class="rank-letter">{{ playerStats.rankInfo.ascii }}</p>
                </div>
                <div class="progressBar">
                  <div class="progressBarFill"
                    :style="{ width: (100 - (100 / (playerStats.rankInfo.prevRank.percentile - playerStats.rankInfo.nextRank.percentile) *  (playerStats.percentile - playerStats.rankInfo.nextRank.percentile)))  + '%' }">
                  </div>
                </div>
              </div>
              <div class="nextRank">
                <p>{{ playerStats.rankInfo.nextRank.percentile }}%</p>
                <p class="rank-letter">{{ playerStats.rankInfo.nextRank.ascii }}</p>
              </div>
            </div>

            <div class="queueInfos">
              <p><span>{{ playersInQueue }}</span> in Queue</p>
              <p><span>0</span> in Games</p>
            </div>

            <div class="matchmakingButton" @click="toggleQueue" :class="{ 'in-queue': isInQueue }">
              <div v-if="isInQueue">
                <p>Leave Queue | Passed Time: {{ passedTime }}s</p>
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
              <Leaderboard :gameMode="GameMode.Ranked" :fields="['rank', 'rating']" :sortBy="'rating'"
                :sortDirection="SortDirection.Desc" :leaderboardCategory="LeaderboardCategory.Global" :limit="30" />
            </div>
            <div v-if="currentLeaderboard === 'National'" class="l-tab national-tab">
              <Leaderboard :gameMode="GameMode.Ranked" :fields="['rank', 'rating']" :sortBy="'rating'"
                :sortDirection="SortDirection.Desc" :leaderboardCategory="LeaderboardCategory.National" :limit="30" />
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
  rankInfo: RankInfo;
}

interface RankInfo {
  ascii: string;
  name: string;
  percentile: number;
  prevRank?: Rank;
  nextRank?: Rank;
}

interface Rank {
  ascii: string;
  percentile: number;
  name: string;
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
  font-size: 35px;
  padding: 10px;
  cursor: pointer;
  background-color: grey;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: 300ms;
}

.in-queue {
  background-color: rgb(80, 80, 80);
  color: #fff;
}

p {
  margin: unset;
}

.playerStats {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  font-size: 150%;
}

.playerStats .rating, 
.playerStats .rank {
  font-size: 200%;
}

.playerStats .rank {
  margin-right: 30px;
}

.playerStats .rating span {
  font-size: 50%;
}

.playerStats div {
  display: flex;
}

.queueInfos {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  font-size: 30px;
  padding: 10px 0;
}

.queueInfos p {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.queueInfos span {
  font-size: 200%;
  margin-right: 10px;
}

.progressBarWrapper {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
}

.progressBarWrapper .rank-letter {
  font-size: 200%;
}

.progress {
  display: flex;
  flex-direction: column;
  width: 80%;
  align-items: center;
  position: relative;
}

.currentRank {
  position: absolute;
  bottom: 80%;
  /* bottom: 50%;
  transform: translateY(50%); */
}

.progressBar {
  background-color: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  border-radius: 15px;
  height: 15px;
}

.progressBarFill {
  background-color: rgb(206, 0, 175);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.prevRank {
  padding-left: 15px;
}

.nextRank {
  padding-right: 15px;
}

.prevRank,
.nextRank,
.currentRank {
  display: flex;
  gap: 10px;
  align-items: center
}
</style>