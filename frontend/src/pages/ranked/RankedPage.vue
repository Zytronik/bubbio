<template>
  <section id="multiMenu" class="page menu">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="page-container">
        <div v-if="!hasMatchFound" class="page-dashboard ranked-dashboard">
          <div class="left-content">

            <div class="playerStats" v-if="playerStats">
              <div>
                <p v-if="playerStats.rankInfo" class="rank-letter">{{ playerStats.rankInfo.ascii }}</p>
                <div>
                  <p class="rating">{{ playerStats.rating }}<span>±{{ playerStats.ratingDeviation }}</span></p>
                  <p class="gamesWon"><span>Games won: </span>{{ playerStats.gamesWon }}/{{ playerStats.gamesCount }}
                  </p>
                </div>
              </div>
              <p class="rank">
                <span v-if="currentLeaderboard === 'Global'" class="global">#{{ playerStats.globalRank }}</span>
                <span v-if="currentLeaderboard === 'National'" class="national">#{{ playerStats.nationalRank }}</span>
              </p>
            </div>

            <div v-if="playerStats" class="progressBarWrapper">
              <div v-if="playerStats.rankInfo.prevRank?.ascii" class="prevRank">
                <p v-if="playerStats.rankInfo.percentile">{{ playerStats.rankInfo.percentile }}%</p>
                <p v-if="playerStats.rankInfo.prevRank.ascii" class="rank-letter">{{ playerStats.rankInfo.prevRank.ascii
                  }}</p>
              </div>
              <div class="progress">
                <div class="progressBar">
                  <div class="progressBarFill" :style="{
                    '--percentile-content': `'${playerStats.percentile}%'`,
                    'width': getProgressBarFillWidth()
                  }"></div>
                </div>
              </div>
              <div class="nextRank" v-if="playerStats.rankInfo.nextRank">
                <p v-if="playerStats.rankInfo.nextRank.percentile">{{ playerStats.rankInfo.nextRank.percentile }}%</p>
                <p v-if="playerStats.rankInfo.nextRank.ascii" class="rank-letter">{{ playerStats.rankInfo.nextRank.ascii
                  }}</p>
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
  nationalRank: number;
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

    function getProgressBarFillWidth() {
      if (!playerStats.value || !playerStats.value.rankInfo.prevRank || !playerStats.value.rankInfo.nextRank) {
        return '0%';
      }
      return (100 - (100 / (playerStats.value.rankInfo.percentile - playerStats.value.rankInfo.nextRank.percentile) *  (playerStats.value.percentile - playerStats.value.rankInfo.nextRank.percentile)))  + '%';
    }

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
      getProgressBarFillWidth,
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
  margin-left: 30px;
}

.playerStats .rank-letter {
  font-size: 290%;
  margin-right: 30px;
}

.playerStats .gamesWon span {
  opacity: 0.5;
}

.playerStats .rating span {
  font-size: 50%;
  opacity: 0.5;
}

.playerStats > div {
  display: flex;
}

.playerStats > div > div{
  display: flex;
  flex-direction: column;
  align-items: center
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
}

.progressBar {
  background-color: #575757;
  height: 100%;
  width: 100%;
  display: flex;
  height: 15px;
}

.progressBarFill {
  background-color: rgb(244, 205, 33);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: relative;
  --percentile-content: '';
}

.progressBarFill::before {
  content: var(--percentile-content);
  position: absolute;
  right: 0;
  transform: translateX(50%);
  top: calc(100% + 10px);
}

.progressBarFill::after {
  content: "";
  width: 3px;
  height: 200%;
  transform: translateY(-50%);
  position: absolute;
  right: 0;
  top: 50%;
  background-color: rgb(244, 205, 33);
}

.prevRank,
.nextRank {
  display: flex;
  width: 10%;
  gap: 10px;
  justify-content: center;
  align-items: center
}
</style>