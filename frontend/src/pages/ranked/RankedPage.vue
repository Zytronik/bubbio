<template>
  <section id="rankedPage" class="page menu">
    <MenuBackButtons :buttonData="backButtonData" :specialBehavior="specialBackButtonBehavior"
      @special-click-event="goBackToRankedPage" />
    <div class="page-wrapper">
      <div class="page-container">
        <div v-if="!isGaming && showMatchmakingScreen" class="page-dashboard ranked-dashboard">
          <h2 id="matchFoundText">Match Found!</h2>
          <div id="matchFoundBackground"></div>
          <div class="left-content">

            <div class="playerStats" v-if="playerStats && isLoggedIn">
              <div>
                <img v-if="playerStats.rankInfo.iconName && playerStats.rankInfo.isRanked" class="rank-img"
                  :src="getRankImagePath(playerStats.rankInfo.iconName)" :alt="playerStats.rankInfo.name">
                <div>
                  <p class="rating">{{ playerStats.rating }}<span>±{{ playerStats.ratingDeviation }}</span></p>
                  <p v-if="playerStats.rankInfo.isRanked" class="gamesWon"><span>Games won: </span>{{
                    playerStats.gamesWon }}/{{ playerStats.gamesPlayed }}
                  </p>
                </div>
              </div>
              <p v-if="playerStats.rankInfo.isRanked" class="rank">
                <span v-if="currentLeaderboard === 'Global'" class="global">#{{ playerStats.globalRank }}</span>
                <span v-if="currentLeaderboard === 'National'" class="national">#{{ playerStats.nationalRank }}</span>
              </p>
            </div>

            <div v-if="playerStats && playerStats.rankInfo.isRanked && isLoggedIn" class="progressBarWrapper">
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
            <div v-else>
              <div v-if="!isLoggedIn">Please Log In or Sign Up to Play Ranked</div>
              <div v-else>
                <p>Play some Ranked Games to get Ranked.</p>
                <div v-if="playerStats" class="probablyAroundRank">
                  <p>Probably around:</p>
                  <img v-if="playerStats.rankInfo.iconName" class="rank-img"
                    :src="getRankImagePath(playerStats.rankInfo.iconName)">
                </div>
              </div>
            </div>

            <div class="queueInfos" v-if="isLoggedIn">
              <p><span>{{ playersInQueue }}</span> in Queue</p>
              <p><span>{{ rankedMatchesCount }}</span> in Games</p>
            </div>

            <div v-if="isLoggedIn" class="matchmakingButton" @click="toggleQueue" :class="{ 'in-queue': isInQueue }">
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

        <div v-if="showScores && playerStats" class="scores-wrapper">
          <div :class="getPlayerCSSClass(scoreScreenData.player1Data.playerID)">
            <p>{{ scoreScreenData.player1Data.playerName }}</p>
            <p class="score">{{ scoreScreenData.player1Data.playerScore }}</p>
          </div>
          <div :class="getPlayerCSSClass(scoreScreenData.player2Data.playerID)">
            <p>{{ scoreScreenData.player2Data.playerName }}</p>
            <p class="score">{{ scoreScreenData.player2Data.playerScore }}</p>
          </div>
          <p class="firstTo">FT{{ scoreScreenData.firstTo }}</p>
        </div>

        <div v-if="showEndScreen" class="endScreen-wrapper">
          <div :class="getPlayerCSSClass(endScreenData.player1Data.playerID)" class="player">
            <div>
              <p>{{ endScreenData.player1Data.playerName.toUpperCase() }}</p>
            </div>
            <img class="profile-pic" :src="endScreenData.player1Data.playerProfilePic ?? getDefaultProfilePbURL()"
              alt="profile-pic">
          </div>
          <div class="rounds-wrapper">
            <div class="total">
              <div :class="getPlayerCSSClass(endScreenData.player1Data.playerID)" class="player">
                <p>{{ endScreenData.player1Data.playerScore }}</p>
              </div>
              <div :class="getPlayerCSSClass(endScreenData.player2Data.playerID)" class="player">
                <p>{{ endScreenData.player2Data.playerScore }}</p>
              </div>
            </div>
            <div class="rounds">
              <div class="r-player" :class="getPlayerCSSClass(endScreenData.player1Data.playerID)">
                <div v-for="(roundStats1, index) in endScreenData.player1Data.playerStats as GameStats[]" :key="'player1-round-' + index" class="round">
                  <p><span>{{ formatFloat(roundStats1.attackPerMinute) }}</span>APM</p>
                  <p><span>{{ formatFloat(roundStats1.bubblesPerSecond) }}</span>BPS</p>
                  <p><span>{{ formatFloat(roundStats1.defensePerMinute) }}</span>DPM</p>
                  <span>{{ formatTimeNumberToString(roundStats1.gameDuration) }}</span>
                </div>
              </div>
              <div class="r-player" :class="getPlayerCSSClass(endScreenData.player2Data.playerID)">
                <div v-for="(roundStats2, index) in endScreenData.player2Data.playerStats as GameStats[]" :key="'player2-round-' + index" class="round">
                  <p><span>{{ formatFloat(roundStats2.attackPerMinute) }}</span>APM</p>
                  <p><span>{{ formatFloat(roundStats2.bubblesPerSecond) }}</span>BPS</p>
                  <p><span>{{ formatFloat(roundStats2.defensePerMinute) }}</span>DPM</p>
                </div>
              </div>
            </div>
          </div>
          <div :class="getPlayerCSSClass(endScreenData.player2Data.playerID)" class="player">
            <div>
              <p>{{ endScreenData.player2Data.playerName.toUpperCase() }}</p>
            </div>
            <img class="profile-pic" :src="endScreenData.player2Data.playerProfilePic ?? getDefaultProfilePbURL()"
              alt="profile-pic">
          </div>
        </div>

        <div v-if="isGaming" class="gaming-wrapper">
          <Game :playerGameVisuals="playerGameVisuals" :areRef="true" :gameMode="GameMode.Ranked" />
          <Game :playerGameVisuals="enemyVisuals" :areRef="true" :gameMode="GameMode.Ranked" />
        </div>

      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import state from '@/ts/networking/networking.client-websocket';
import VsScreen from './components/VsScreen.vue';
import { httpClient } from '@/ts/networking/networking.http-client';
import Leaderboard from '@/globalComponents/Leaderboard.vue';
import { GameMode, LeaderboardCategory, SortDirection } from '@/ts/page/e/page.e-leaderboard';
import { UserData } from '@/ts/page/i/page.i.user-data';
import eventBus from '@/ts/page/page.event-bus';
import { getDefaultProfilePbURL, getRankImagePath } from '@/ts/networking/paths';
import { scoreScreenData, endScreenData, network_stopListeningToServer, enemyVisuals, I_RANKED_SCREEN_TRANSITION_CONFIRMATION } from '@/ts/game/network/game.network.ranked';
import { network_listenToMatchFound } from '@/ts/game/network/game.network.ranked';
import { playerGameVisuals } from '@/ts/game/game.master';
import Game from '@/pages/game/Game.vue';
import { backInput } from '@/ts/input/input.all-inputs';
import { disableResetInput, enableBackInputs } from '@/ts/input/input.input-manager';
import { RankInfo } from '@/ts/page/i/page.i-rank-info';
import { checkUserAuthentication } from '@/ts/networking/networking.auth';
import { GameStats } from '@/ts/game/i/game.i.game-stats';
import { formatTimeNumberToString } from '@/ts/game/visuals/game.visuals.stat-display';

interface PlayerMatchmakingStats {
  userId: number;
  rating: number;
  ratingDeviation: number;
  globalRank: number;
  nationalRank: number;
  gamesWon: number;
  gamesPlayed: number;
  percentile: number;
  rankInfo: RankInfo;
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
    const specialBackButtonBehavior = ref(false);
    const showMatchmakingScreen = ref(true);
    const showScores = ref(false);
    const showEndScreen = ref(false);
    const isInQueue = ref<boolean>(false);
    const playerStats = ref<PlayerMatchmakingStats | null>(null);
    const playersInQueue = ref<number>(0);
    const rankedMatchesCount = ref<number>(0);
    const passedTime = ref<number>(0);
    const userData: UserData | null = eventBus.getUserData();
    const hasMatchFound = ref<boolean>(false);
    const backInputOnLoad = ref<() => void>(() => "");
    let passedTimeInterval: ReturnType<typeof setInterval> | undefined = 0;
    const isLoggedIn = computed(() => checkUserAuthentication() && !sessionStorage.getItem('isGuest'));

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
          showMatchmakingScreen.value = false;
        }, 500);
      }, 1000);
    }

    function mountSockets() {
      if (state.socket) {
        state.socket.emit('playerJoinedMmVue');

        state.socket.on('queueSize', (size: number) => {
          playersInQueue.value = size;
        });
        state.socket.on('rankedGamesCount', (amount: number) => {
          rankedMatchesCount.value = amount;
        });
      }
    }

    function unmountSockets() {
      leaveQueue();
      if (state.socket) {
        state.socket.emit('playerLeftMmVue');
        state.socket.off('queueSize');
        state.socket.off('rankedGamesCount');
      }
    }

    function goToGameView() {
      isGaming.value = true;
      hasMatchFound.value = false;
      showMatchmakingScreen.value = false;
      specialBackButtonBehavior.value = false;
    }

    async function slideScoresIn(onAnimationnEnd: () => void) {
      showScores.value = true;
      await nextTick();
      const player1 = document.querySelector('.scores-wrapper .player1') as HTMLElement;
      const player2 = document.querySelector('.scores-wrapper .player2') as HTMLElement;
      const firstTo = document.querySelector('.scores-wrapper .firstTo') as HTMLElement;
      if (player1 && player2) {
        player1.classList.add('slide-in-from-left');
        player2.classList.add('slide-in-from-right');
        setTimeout(() => {
          firstTo.classList.add('fadeIn05');
        }, 500); // css duration
        setTimeout(() => {
          firstTo.classList.add('fadeOut05');
          setTimeout(() => {
            player1.classList.add('slide-out-to-left');
            player2.classList.add('slide-out-to-right');
            setTimeout(() => {
              player1.classList.remove('slide-in-from-left', 'slide-out-to-left');
              player2.classList.remove('slide-in-from-right', 'slide-out-to-right');
              firstTo.classList.remove('fadeIn05', 'fadeOut05');
              showScores.value = false;
              onAnimationnEnd();
            }, 500);//css animation duration
          }, 500); // css duration
        }, 3000);
      }
    }

    function transitionOutOfGame(onTransitionHidden: () => void): void {
      setTimeout(() => {
        document.body.classList.add('slide-out-right-off-game');
        const overlay = document.createElement('div');
        overlay.className = 'black-overlay-left';
        document.body.appendChild(overlay);
        setTimeout(() => {
          overlay.classList.add('black-overlay-cover');
          onTransitionHidden();
          overlay.classList.remove('black-overlay-left');
          document.body.classList.remove('slide-out-right-off-game');
          document.body.classList.remove('game-view');
          setTimeout(() => {
            disableResetInput();
            backInput.fire = goBackToRankedPage;
            enableBackInputs();
            document.body.removeChild(overlay);
          }, 1000);
        }, 500);
      }, 1500);
    }

    function showMatchScore() {
      slideScoresIn(() => {
        if (state.socket) {
          state.socket.emit(I_RANKED_SCREEN_TRANSITION_CONFIRMATION, scoreScreenData.matchID);
        }
      });
    }

    function goBackToRankedPage() {
      if (showEndScreen.value) {
        transitionEndScreenPageToDashboard();
        backInput.fire = backInputOnLoad.value;
      }
    }

    function showEndScreenPage() {
      console.log('showEndScreen', endScreenData);
      transitionOutOfGame(() => {
        isGaming.value = false;
        showMatchmakingScreen.value = false;
        showEndScreen.value = true;
        fetchPlayerMmStats();
        specialBackButtonBehavior.value = true;
      });
    }

    async function transitionEndScreenPageToDashboard() {
      isGaming.value = false;
      showEndScreen.value = true;
      showMatchmakingScreen.value = true;
      specialBackButtonBehavior.value = false;
      await nextTick(); // if i dont do this, dashboard is undefined
      const dashboard = document.querySelector('.ranked-dashboard') as HTMLElement;
      const resultScreen = document.querySelector('.endScreen-wrapper') as HTMLElement;
      const container = document.querySelector('.page-container') as HTMLElement;
      container.classList.add('flex-row'); //add flex-row to container
      dashboard.classList.add('moveResultScreen-left'); //position dashboard to the left
      resultScreen.classList.add('slideToRight'); //slide result screen to the left
      dashboard.classList.add('slideLeftToCenter'); //slide dashboard to the left
      setTimeout(() => {
        resultScreen.classList.remove('slideToRight'); //reset styles
        showEndScreen.value = false; //remove result screen
        dashboard.classList.remove('moveResultScreen-left'); //reset styles
        dashboard.classList.remove('slideLeftToCenter'); //reset styles
        container.classList.remove('flex-row') //remove flex-row from container
      }, 500);
    }

    function formatFloat(num: number) {
      const formattedNumber = num.toFixed(2);
      let [integral, decimal] = formattedNumber.split('.');
      integral = integral.padStart(2, '0');
      return `${integral}.${decimal}`;
    }

    function getPlayerCSSClass(playerID: number) {
      return playerStats.value && playerStats.value.userId === playerID ? 'player1' : 'player2';
    }

    onMounted(() => {
      changeBackgroundTo('linear-gradient(45deg, rgba(126,10,41,1) 0%, rgba(144,141,58,1) 100%)');
      backInputOnLoad.value = backInput.fire;
      if (isLoggedIn.value) {
        fetchPlayerMmStats();
        mountSockets();
        eventBus.on("vue_matchFound", matchFound);
        eventBus.on('vue_goToGameView', goToGameView);
        eventBus.on('vue_showMatchScore', showMatchScore);
        eventBus.on('vue_showEndScreen', showEndScreenPage);
      }
    });

    onUnmounted(() => {
      leaveQueue();
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
      rankedMatchesCount,
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
      goBackToRankedPage,
      specialBackButtonBehavior,
      isLoggedIn,
      endScreenData,
      getDefaultProfilePbURL,
      formatTimeNumberToString,
      formatFloat,
      getPlayerCSSClass,
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

.probablyAroundRank {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
}

.probablyAroundRank .rank-img {
  height: 15px;
  margin-left: 5px;
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
  justify-content: space-evenly;
  align-items: center;
}

.gaming-wrapper::before,
.gaming-wrapper::after {
  content: "";
  width: 50vw;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
}

.gaming-wrapper::before {
  left: 0;
  background: linear-gradient(45deg, rgba(126, 10, 41, 1) 0%, rgba(144, 141, 58, 1) 100%);
}

.gaming-wrapper::after {
  right: 0;
  background: linear-gradient(45deg, rgb(10, 126, 88) 0%, rgb(144, 141, 58) 100%);
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

.scores-wrapper .firstTo {
  position: absolute;
  left: 50%;
  top: 1%;
  font-size: 2.2em;
  transform: translateX(-50%);
  opacity: 0;
  z-index: 1;
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
  order: 1;
  transform: translateX(-100%);
}

.scores-wrapper .player2 {
  order: 2;
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
  background-color: rgb(30, 30, 30);
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
}

.endScreen-wrapper > .player {
  width: 28%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.endScreen-wrapper > .player1 {
  flex-direction: column-reverse;
}

.endScreen-wrapper .profile-pic {
  width: 100%;
  height: 92%;
  object-fit: cover;
}

.endScreen-wrapper > .player div p {
  font-size: 1.77em;
}
.endScreen-wrapper .rounds-wrapper {
  width: 44%;
  order: 2;
}

.endScreen-wrapper > .player>div {
  height: 8%;
  display: flex;
  align-items: center;
}

.endScreen-wrapper .total {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 30px;
}

.endScreen-wrapper .total .player1{
  order: 1;
}

.endScreen-wrapper .total .player2{
  order: 2;
}

.endScreen-wrapper .total p {
  font-size: 4em;
}

.endScreen-wrapper .round>span {
  position: absolute;
  text-align: center;
  width: 100px;
}

.endScreen-wrapper .player1 .round>span {
  left: 100%;
}

.endScreen-wrapper .player2 .round>span {
  right: 100%;
}

.endScreen-wrapper .round p {
  width: 30%;
}

.endScreen-wrapper .round p span {
  width: 50px;
}

.endScreen-wrapper .round p {
  display: flex;
}

.endScreen-wrapper .rounds {
  display: flex;
  justify-content: space-between;
}

.endScreen-wrapper .round {
  display: flex;
  position: relative;
  gap: 5px;
  padding: 10px 15px;
  margin: 15px 0;
}

.endScreen-wrapper .rounds .player {
  width: 50%;
}

.endScreen-wrapper .rounds .r-player {
  width: calc(50% - 50px);
}

.endScreen-wrapper .r-player.player1 .round {
  background: linear-gradient(45deg, rgba(126, 10, 41, 1) 0%, rgba(144, 141, 58, 1) 100%);
  justify-content: flex-end;
}

.endScreen-wrapper .r-player.player2 .round {
  background: linear-gradient(45deg, rgb(10, 126, 88) 0%, rgb(144, 141, 58) 100%);
}

.endScreen-wrapper .r-player.player1 p {
  justify-content: flex-end;
}

.endScreen-wrapper .r-player.player1 {
  order: 1;
}

.endScreen-wrapper .r-player.player2 {
  order: 2;
}

.endScreen-wrapper > .player1 {
  order: 1;
}

.endScreen-wrapper > .player2 {
  order: 3;
}
</style>