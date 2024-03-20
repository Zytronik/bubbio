<template>
  <section id="template" class="page">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="page-container">

        <div v-if="!isGaming && isDashboard" class="sprintDashboard">

          <div class="left-content">
            <div class="cat-wrapper">
              <button v-for="mod in modsComputed" :key="mod.abr" class="cat" :class="{ 'active': mod.enabled }"
                @click="toggleMod(mod.abr)">
                {{ mod.title }}
              </button>
            </div>
            <button class="playButton" @click="play()">Play!</button>
            <History v-if="!isGuest" :gameMode="GameMode.Sprint"
              :fields="['gameDuration', 'bubblesShot', 'bubblesPerSecond', 'bubblesCleared', 'submittedAt', 'mods']"
              :sortBy="'submittedAt'" :sortDirection="SortDirection.Desc" :limit="10" />
            <h4 v-else><br>Log in for Stats and Submit Scores.</h4>
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
              <Leaderboard :gameMode="GameMode.Sprint" :fields="['gameDuration', 'bubblesPerSecond']"
                :sortBy="'gameDuration'" :sortDirection="SortDirection.Asc"
                :leaderboardCategory="LeaderboardCategory.Global" :limit="30" :mods="modsEnabled" />
            </div>
            <div v-if="currentLeaderboard === 'National'" class="l-tab national-tab">
              <Leaderboard :gameMode="GameMode.Sprint" :fields="['gameDuration', 'bubblesPerSecond']"
                :sortBy="'gameDuration'" :sortDirection="SortDirection.Asc"
                :leaderboardCategory="LeaderboardCategory.National" :limit="30" :mods="modsEnabled" />
            </div>
          </div>

        </div>

        <div v-if="isGaming" class="inGame">
          <button class="backButton" @click="goBack()">Back</button>
          <div class="game-wrapper">
            <Game />
            <div class="inGameStats">
              <p>{{ formattedCurrentTime }}</p>
              <p>{{ bubblesCleared }}/{{ bubbleClearToWin }}</p>
              <p>{{ bubblesShot }} BPS: {{ bubblesPerSecond }}</p>
            </div>
          </div>
        </div>

        <div v-if="!isGaming && !isDashboard" class="gameComplete">
          <button @click="goBack()">Back</button>
          <button @click="play()">Try Again</button>
          <table v-if="resultStats">
            <tbody>
              <tr v-for="(value, key) in resultStats" :key="key">
                <td>{{ getFullName(key) }}</td>
                <td>{{ formatFieldValue(value, key) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Game from '../game/Game.vue';
import { changeBackgroundTo, formatDateTime, goToState } from '@/ts/page/page.page-manager';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';
import { computed, onMounted, ref, withKeys } from 'vue';
import { getGameStats, leaveGame, setupSprintGame, startGame } from '@/ts/game/game.master';
import { bubbleClearToWin, bubblesCleared, bubblesPerSecond, bubblesShot, formatTimeNumberToString, formattedCurrentTime } from '@/ts/game/visuals/game.visuals.stat-display';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import Leaderboard from '@/globalComponents/Leaderboard.vue';
import History from '@/globalComponents/History.vue';
import { GameMode, LeaderboardCategory, SortDirection } from '@/ts/page/page.e-leaderboard';
import { UserData } from '@/ts/page/page.i-userData';
import eventBus from '@/ts/page/page.event-bus';
import { allMods as importedMods } from '@/ts/game/settings/game.settings.all-mods';
import { GameStats } from '@/ts/game/i/game.i.game-stats';
import { backInput, resetInput } from '@/ts/input/input.all-inputs';
import { formatFieldValue, getFullName } from '@/ts/page/page.i.stat-display';

export default {
  name: 'SprintPage',
  components: { Game, MenuBackButtons, Leaderboard, History },
  data() {
    return {
      currentLeaderboard: 'Global',
      leaderboardTabs: ['Global', 'National'],
    };
  },
  setup() {
    const mods = ref(importedMods);
    const isGaming = ref<boolean>(false);
    const isDashboard = ref<boolean>(true);
    const resultStats = ref<GameStats>();
    const userData: UserData | null = eventBus.getUserData();
    const isGuestString = sessionStorage.getItem('isGuest');
    const isGuest = Boolean(isGuestString && isGuestString.toLowerCase() === 'true');
    const backButtonData = ref([
      { pageState: PAGE_STATE.soloMenu, iconSrc: require('@/img/icons/sprint.png'), disabled: false },
    ]);

    onMounted(() => {
      changeBackgroundTo('linear-gradient(45deg, rgba(43,156,221,1) 0%, rgba(198,141,63,1) 100%)');
      eventBus.on("sprintVictory", showResultView);
    });

    function goBack() {
      if (isGaming.value) {
        leaveGame();
        showDashboard();
      }
      if (!isDashboard.value && !isGaming.value) {
        showDashboard();
      }
    }

    function play() {
      backInput.fire = goBack;
      setupSprintGame();
      showGameView();
      startGame();
    }

    async function showDashboard() {
      isGaming.value = false;
      isDashboard.value = true;
    }

    function showGameView() {
      isGaming.value = true;
      isDashboard.value = false;
    }

    function showResultView() {
      resultStats.value = getGameStats();
      resetInput.fire = play;
      isGaming.value = false;
      isDashboard.value = false;
    }

    const toggleMod = (modAbr: string) => {
      const modIndex = mods.value.findIndex(m => m.abr === modAbr);
      if (modIndex !== -1) {
        mods.value[modIndex].enabled = !mods.value[modIndex].enabled;
      }
    };

    const modsComputed = computed(() => mods.value.map(mod => ({
      ...mod,
      isEnabled: mod.enabled,
    })));

    const modsEnabled = computed(() => {
      return mods.value
        .filter(mod => mod.enabled)
        .map(mod => mod.abr);
    });

    return {
      formattedCurrentTime,
      bubbleClearToWin,
      bubblesCleared,
      bubblesShot,
      bubblesPerSecond,
      goToState,
      PAGE_STATE,
      play,
      isGaming,
      isDashboard,
      startGame,
      formatDateTime,
      formatTimeNumberToString,
      isGuest,
      backButtonData,
      changeBackgroundTo,
      GameMode,
      LeaderboardCategory,
      SortDirection,
      userData,
      toggleMod,
      modsComputed,
      modsEnabled,
      goBack,
      resultStats,
      formatFieldValue,
      getFullName,
    };
  },
};
</script>

<style scoped>
.back-buttons::before {
  background: linear-gradient(45deg, rgba(96, 221, 43, 1) 0%, rgba(198, 63, 135, 1) 100%);
}

.sprintDashboard {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  gap: 15px;
}

.sprintDashboard>div {
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.left-content {
  width: 72%;
}

.right-content {
  width: 28%;
}

.l-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
}

.l-tab-button {
  background-color: rgb(30, 30, 30);
  color: white;
  border: none;
  margin-left: 15px;
  opacity: 0.5;
  cursor: pointer;
  border: 1px solid white;
  border-bottom: unset;
  padding: 5px 15px;
  font-size: 90%;
  position: relative;
}

.l-tab-button.active::after {
  content: "";
  background-color: rgb(30, 30, 30);
  position: absolute;
  height: 1px;
  width: 100%;
  left: 0;
  top: 100%;
}

.l-tab-buttons {
  margin-bottom: 15px;
  border-bottom: 1px solid white;
}

.l-tab-button.active {
  opacity: 1;
}

.cat-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 15px;
  height: 10%;
  margin-bottom: 15px;
}

.cat-wrapper .cat {
  width: 50%;
  height: 100%;
  font-size: 150%;
  cursor: pointer;
  border: none;
  transition: 0.2s;
  background-color: #ffffff;
  opacity: 0.2;
}

.cat-wrapper .cat:hover {
  opacity: 0.7 !important;
}

.cat-wrapper .cat.active {
  opacity: 1;
}

.game-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
}

.inGame {
  height: 100%;
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.inGameStats {
  position: absolute;
  right: calc(100% + 15px);
  bottom: 10px;
  width: 200px;
  text-align: right;
}

.inGameStats p {
  margin: unset;
  margin-top: 5px;
  font-size: 20px;
}

.inGame .backButton {
  position: absolute;
  left: 30px;
  top: 30px;
}
</style>
