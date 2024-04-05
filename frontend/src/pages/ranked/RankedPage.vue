<template>
  <section id="multiMenu" class="page menu">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="page-container">
        <div v-if="!isGaming && !showMatchmakingScreen" class="page-dashboard ranked-dashboard">
          <h2 id="matchFoundText">Match Found!</h2>
          <div id="matchFoundBackground"></div>
          <div class="left-content">

            <div class="playerStats" v-if="playerStats">
              <div>
                <img class="rank-img" :src="getRankImagePath(playerStats.rankInfo.iconName)"
                  :alt="playerStats.rankInfo.name">
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
              <div class="prevRank">
                <p v-if="playerStats.rankInfo.prevRank?.ascii">{{ playerStats.rankInfo.percentile }}%</p>
                <img v-if="playerStats.rankInfo.prevRank?.iconName" class="rank-img"
                  :src="getRankImagePath(playerStats.rankInfo.prevRank.iconName)"
                  :alt="playerStats.rankInfo.prevRank.name">
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
                <img v-if="playerStats.rankInfo.nextRank?.iconName" class="rank-img"
                  :src="getRankImagePath(playerStats.rankInfo.nextRank.iconName)"
                  :alt="playerStats.rankInfo.nextRank.name">
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

        <div v-if="hasMatchFound && !isGaming">
          <VsScreen />
        </div>

        <div v-if="showScores" class="scores-wrapper">
          <div class="player1">
            <p>{{ scoreScreenData.player1Data.playerName }}</p>
            <p class="score">{{ scoreScreenData.player1Data.playerScore }}</p>
          </div>
          <div class="player2">
            <p>{{ scoreScreenData.player2Data.playerName }}</p>
            <p class="score">{{ scoreScreenData.player2Data.playerScore }}</p>
          </div>
        </div>

        <div v-if="showEndScreen" class="endScreen-wrapper">
          <p>Please give me data to display here.</p>
          <p>TODO: <br>transition to here<br>show data here<br>transition to ranked dashboard</p>
        </div>

        <div v-if="isGaming" class="gaming-wrapper">
          <Game :playerGameVisuals="playerGameVisuals" :areRef="true" />
          <Game :playerGameVisuals="enemyVisuals" :areRef="true" />
        </div>

      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import state from '@/ts/networking/networking.client-websocket';
import VsScreen from './components/VsScreen.vue';
import { httpClient } from '@/ts/networking/networking.http-client';
import Leaderboard from '@/globalComponents/Leaderboard.vue';
import { GameMode, LeaderboardCategory, SortDirection } from '@/ts/page/e/page.e-leaderboard';
import { UserData } from '@/ts/page/i/page.i.user-data';
import eventBus from '@/ts/page/page.event-bus';
import { getRankImagePath } from '@/ts/networking/paths';
import { scoreScreenData, endScreenData, network_stopListeningToServer, enemyVisuals, I_RANKED_SCREEN_TRANSITION_CONFIRMATION } from '@/ts/game/network/game.network.ranked';
import { network_listenToMatchFound } from '@/ts/game/network/game.network.ranked';
import { playerGameVisuals } from '@/ts/game/game.master';
import Game from '@/pages/game/Game.vue';

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
  iconName: string;
  percentile: number;
  prevRank?: Rank;
  nextRank?: Rank;
}

interface Rank {
  ascii: string;
  percentile: number;
  name: string;
  iconName: string;
}

export default {
  name: 'RankedPage',
  components: { MenuBackButtons, VsScreen, Leaderboard, Game },
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
    const isGaming = ref(false);
    const showMatchmakingScreen = ref(false);
    const showScores = ref(false);
    const showEndScreen = ref(false);
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
      return (100 - (100 / (playerStats.value.rankInfo.percentile - playerStats.value.rankInfo.nextRank.percentile) * (playerStats.value.percentile - playerStats.value.rankInfo.nextRank.percentile))) + '%';
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
        network_stopListeningToServer();
      }
    }

    function enterQueue() {
      if (state.socket) {
        startPassedTimeCountdown();
        state.socket.emit('enterQueue');
        network_listenToMatchFound();
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
      playMatchFoundAnimation();
    }

    function playMatchFoundAnimation() {
      document.getElementById('matchFoundText')?.classList.add('matchFoundText');
      document.getElementById('matchFoundBackground')?.classList.add('blackOpacity');
      setTimeout(() => {
        hasMatchFound.value = true;
        setTimeout(() => {
          showMatchmakingScreen.value = true;
        }, 500);
      }, 1000);
    }

    function mountSockets() {
      if (state.socket) {
        state.socket.emit('playerJoinedMmVue');

        state.socket.on('queueSize', (size: number) => {
          playersInQueue.value = size;
        });
      }
    }

    function unmountSockets() {
      leaveQueue();
      if (state.socket) {
        state.socket.emit('playerLeftMmVue');
        state.socket.off('queueSize');
      }
    }

    function goToGameView() {
      isGaming.value = true;
      hasMatchFound.value = false;
      showMatchmakingScreen.value = false;
    }

    async function slideScoresIn(onAnimationnEnd: () => void) {
      showScores.value = true;
      await nextTick();
      const player1 = document.querySelector('.scores-wrapper .player1') as HTMLElement;
      const player2 = document.querySelector('.scores-wrapper .player2') as HTMLElement;
      if (player1 && player2) {
        player1.classList.add('slide-in-from-left');
        player2.classList.add('slide-in-from-right');
        setTimeout(() => {
          player1.classList.add('slide-out-to-left');
          player2.classList.add('slide-out-to-right');
          setTimeout(() => {
            player1.classList.remove('slide-in-from-left', 'slide-out-to-left');
            player2.classList.remove('slide-in-from-right', 'slide-out-to-right');
            showScores.value = false;
            onAnimationnEnd();
          }, 500);//css animation duration
        }, 5000);
      }
    }

    function showMatchScore() {
      slideScoresIn(() => {
        if (state.socket) {
          state.socket.emit(I_RANKED_SCREEN_TRANSITION_CONFIRMATION, scoreScreenData.matchID);
        }
      });
    }

    function showEndScreenPage() {
      console.log('showEndScreen', endScreenData);
      showEndScreen.value = true;
      isGaming.value = false;
    }

    onMounted(() => {
      changeBackgroundTo('linear-gradient(45deg, rgba(126,10,41,1) 0%, rgba(144,141,58,1) 100%)');
      fetchPlayerMmStats();
      mountSockets();
      eventBus.on("vue_matchFound", matchFound);
      eventBus.on('vue_goToGameView', goToGameView);
      eventBus.on('vue_showMatchScore', showMatchScore);
      eventBus.on('vue_showEndScreen', showEndScreenPage);
    });

    onUnmounted(() => {
      unmountSockets();
      stopPassedTimeCountdown();
      eventBus.off("vue_matchFound");
      eventBus.off('vue_goToGameView');
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
      getRankImagePath,
      isGaming,
      playerGameVisuals,
      showMatchmakingScreen,
      enemyVisuals,
      showScores,
      showEndScreen,
      scoreScreenData,
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
  height: 12%;
}

.playerStats .rating,
.playerStats .rank {
  font-size: 200%;
}

.playerStats .rank {
  margin-left: 30px;
}

.playerStats .rank-img {
  object-fit: contain;
  margin-right: 30px;
}

.playerStats .gamesWon span {
  opacity: 0.5;
}

.playerStats .rating span {
  font-size: 50%;
  opacity: 0.5;
}

.playerStats>div {
  display: flex;
  height: 100%;
}

.playerStats>div>div {
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  align-items: center;
}

.prevRank .rank-img,
.nextRank .rank-img {
  object-fit: contain;
  height: 40px;
}

/* VS Transition */
@keyframes fadeZoomIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.4);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.matchFoundText {
  display: block !important;
  font-size: 1300%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.4);
  animation: fadeZoomIn 1s ease forwards;
  z-index: 2;
  width: 100vw;
  text-align: center;
}

.blackOpacity {
  display: block !important;
  animation: fadeInBlack 1s ease forwards;
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

@keyframes fadeInBlack {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.8;
  }
}

#matchFoundText,
#matchFoundBackground {
  display: none;
}

.gaming-wrapper {
  display: flex;
  flex-direction: row;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  font-size: 160%;
  gap: 15%;
}

.scores-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  color: white;
  z-index: 1;
  display: flex;
  flex-direction: row;
}

.scores-wrapper>div {
  width: 50%;
  height: 100%;
  font-size: 4em;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-transform: uppercase;
  position: relative;
  transition: 0.5s;
  background-color: rgba(0, 0, 0, 0.9);
}

.scores-wrapper>div::before {
  content: "";
  position: absolute;
  height: 80%;
  top: 50%;
  transform: translateY(-50%);
}

.scores-wrapper .player1 {
  transform: translateX(-100%);
}

.scores-wrapper .player2 {
  transform: translateX(100%);
}

.scores-wrapper .player1::before {
  border-right: 1px solid white;
  right: 0;
}

.scores-wrapper .player2::before {
  border-left: 1px solid white;
  left: 0;
}

.scores-wrapper .score {
  font-size: 10em;
}

.endScreen-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 1);
  color: white;
  z-index: 1;
}
</style>