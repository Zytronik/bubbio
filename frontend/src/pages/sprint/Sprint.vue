<template>
  <section id="template" class="page">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="page-container">

        <div v-if="isDashboard" class="sprintDashboard">

          <div class="left-content">
            <div class="playMods">
              <button class="playButton" @click="play()">Play!</button>
              <div class="cat-wrapper">
                <div class="cat" v-for="mod in modsComputed" :key="mod.abr.toString()" @click="toggleMod(mod.abr)"
                  :class="{ 'active': mod.type === 'toggle' && mod.enabled }">
                  <!-- ToggleMod -->
                  <div v-if="mod.type === 'toggle'">
                    <img v-if="mod.enabled" :src="getIconPath(mod.icon[0])" alt="Enabled Icon" />
                    <img v-else :src="getIconPath(mod.icon[1])" alt="Disabled Icon" />
                    <span>{{ mod.title }}</span>
                  </div>
                  <!-- MultiMod -->
                  <div v-else-if="mod.type === 'multi'">
                    <img v-if="mod.index != null" :src="getIconPath(mod.icon[mod.index])" alt="Enabled Icon" />
                    <span>{{ mod.title }}</span>
                  </div>
                </div>
              </div>
            </div>
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
                :leaderboardCategory="LeaderboardCategory.Global" :limit="30" :mods="enabledToggleMods" />
            </div>
            <div v-if="currentLeaderboard === 'National'" class="l-tab national-tab">
              <Leaderboard :gameMode="GameMode.Sprint" :fields="['gameDuration', 'bubblesPerSecond']"
                :sortBy="'gameDuration'" :sortDirection="SortDirection.Asc"
                :leaderboardCategory="LeaderboardCategory.National" :limit="30" :mods="enabledToggleMods" />
            </div>
          </div>

        </div>

        <div v-if="isGaming" class="inGame">
          <div class="game-wrapper">
            <Game />
            <div class="inGameStats">
              <p>{{ formattedCurrentTime }}</p>
              <p>{{ bubblesCleared }}/{{ bubbleClearToWin }}</p>
              <p>{{ bubblesShot }} BPS: {{ bubblesPerSecond }}</p>
            </div>
          </div>
        </div>

        <div v-if="isResultView" class="gameComplete">
          <!-- <button @click="goBack()">Back</button> -->
          <div class="top">
            <div class="sprintTime">
              <p class="time">{{ formatTimeNumberToString(sprintResultTime) }}</p>
              <p class="diff"><span>Diff to pb: </span>00:00:69</p>
            </div>
            <button class="retry" @click="play()">Retry</button>
          </div>

          <div v-if="resultStats">
            <div class="columns">
              <div class="column">
                <div class="row" v-for="(value, key) in splitResultStats.firstHalf" :key="`first-${key}`">
                  <div class="col">{{ getFullName(key) }}</div>
                  <div class="col">{{ formatFieldValue(value ?? '', key) }}</div>
                </div>
              </div>
              <div class="column">
                <div class="row" v-for="(value, key) in splitResultStats.secondHalf" :key="`second-${key}`">
                  <div class="col">{{ getFullName(key) }}</div>
                  <div class="col">{{ formatFieldValue(value ?? '', key) }}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Game from '../game/Game.vue';
import { changeBackgroundTo, formatDateTime, getCookie, goToState, setCookie } from '@/ts/page/page.page-manager';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';
import { computed, nextTick, onMounted, ref } from 'vue';
import { getGameStats, leaveGame, setupSprintGame, startGame } from '@/ts/game/game.master';
import { bubbleClearToWin, bubblesCleared, bubblesPerSecond, bubblesShot, formatTimeNumberToString, formattedCurrentTime } from '@/ts/game/visuals/game.visuals.stat-display';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import Leaderboard from '@/globalComponents/Leaderboard.vue';
import History from '@/globalComponents/History.vue';
import { GameMode, LeaderboardCategory, SortDirection } from '@/ts/page/page.e-leaderboard';
import { UserData } from '@/ts/page/page.i-userData';
import eventBus from '@/ts/page/page.event-bus';
import { GameStats } from '@/ts/game/i/game.i.game-stats';
import { backInput, resetInput } from '@/ts/input/input.all-inputs';
import { formatFieldValue, getFullName } from '@/ts/page/page.i.stat-display';
import { fillAsciiStrings } from '@/ts/game/visuals/game.visuals.ascii';
import { MultiMod, ToggleMod } from '@/ts/game/settings/ref/i/game.settings.ref.i.mod';
import { allMods } from '@/ts/game/settings/ref/game.settings.ref.all-mods';
import { disableBackInputs, disableResetInput, enableBackInputs, enableResetInput } from '@/ts/input/input.input-manager';

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
    const mods = ref<(ToggleMod | MultiMod)[]>(allMods);
    const isGaming = ref<boolean>(false);
    const isDashboard = ref<boolean>(true);
    const isResultView = ref<boolean>(false);
    const resultStats = ref<Partial<GameStats>>();
    const userData: UserData | null = eventBus.getUserData();
    const isGuestString = sessionStorage.getItem('isGuest');
    const isGuest = Boolean(isGuestString && isGuestString.toLowerCase() === 'true');
    const backInputOnLoad = ref<() => void>(() => "");
    const sprintResultTime = ref<number>(0);
    const backButtonData = ref([
      { pageState: PAGE_STATE.soloMenu, iconSrc: require('@/img/icons/sprint.png'), disabled: false },
    ]);

    const splitResultStats = computed(() => {
      if (!resultStats.value) {
        return { firstHalf: {}, secondHalf: {} };
      }

      const keys = Object.keys(resultStats.value) as Array<keyof GameStats>;
      const half = Math.ceil(keys.length / 2);
      const firstHalf: Partial<GameStats> = {};
      const secondHalf: Partial<GameStats> = {};

      keys.slice(0, half).forEach((key) => {
        firstHalf[key] = safelyGetStat(resultStats.value, key);
      });

      keys.slice(half).forEach((key) => {
        secondHalf[key] = safelyGetStat(resultStats.value, key);
      });

      return { firstHalf, secondHalf };
    });

    function safelyGetStat<T extends keyof GameStats>(
      stats: Partial<GameStats> | undefined,
      key: T
    ): GameStats[T] | undefined {
      return stats ? stats[key] : undefined;
    }


    onMounted(() => {
      changeBackgroundTo('linear-gradient(45deg, rgba(43,156,221,1) 0%, rgba(198,141,63,1) 100%)');
      eventBus.on("sprintVictory", transitionToResultView);
      applyMods();
      backInputOnLoad.value = backInput.fire;
    });

    function applyMods() {
      const savedModsJson = getCookie('mods');
      if (savedModsJson) {
        try {
          const savedMods: (ToggleMod | MultiMod)[] = JSON.parse(savedModsJson);
          mods.value.forEach(mod => {
            const savedMod = savedMods.find(savedMod => savedMod.abr === mod.abr || savedMod.title === mod.title);
            if (savedMod) {
              if ('enabled' in mod && 'enabled' in savedMod) {
                mod.enabled = savedMod.enabled;
              }
              if ('selected' in mod && 'selected' in savedMod) {
                mod.selected = savedMod.selected;
              }
            }
          });
        } catch (error) {
          console.error('Error parsing mods from cookie:', error);
        }
      }
    }

    function goBack() {
      if (isGaming.value) {
        transitionOutOfGame(() => {
          leaveGame();
          showDashboard();
          backInput.fire = backInputOnLoad.value;
        }, true);
      }
      if (isResultView.value) {
        transitionResultViewToDashboard();
        backInput.fire = backInputOnLoad.value;
      }
    }

    async function transitionResultViewToDashboard() {
      disableResetInput();
      isGaming.value = false;
      isResultView.value = true;
      isDashboard.value = true;
      await nextTick(); // if i dont do this, dashboard is undefined
      const dashboard = document.querySelector('.sprintDashboard') as HTMLElement;
      const resultScreen = document.querySelector('.gameComplete') as HTMLElement;
      const container = document.querySelector('.page-container') as HTMLElement;
      container.classList.add('flex-row'); //add flex-row to container
      dashboard.classList.add('move-left'); //position dashboard to the left
      resultScreen.classList.add('slideToRight'); //slide result screen to the left
      dashboard.classList.add('slideLeftToCenter'); //slide dashboard to the left
      setTimeout(() => {
        resultScreen.classList.remove('slideToRight'); //reset styles
        isResultView.value = false; //remove result screen
        dashboard.classList.remove('move-left'); //reset styles
        dashboard.classList.remove('slideLeftToCenter'); //reset styles
        container.classList.remove('flex-row') //remove flex-row from container
      }, 500);
    }

    function transitionToResultView() {
      transitionOutOfGame(() => {
        showResultView();
      }, false);
    }

    function play() {
      backInput.fire = goBack;
      transitionToGame(() => {
        startGame();
      });
    }

    function transitionToGame(onTransitionEnd: () => void): void {
      disableBackInputs();
      document.body.classList.add('slide-out-left-to-game');
      const overlay = document.createElement('div');
      overlay.className = 'black-overlay-right';
      document.body.appendChild(overlay);
      setTimeout(() => {
        enableBackInputs();
        overlay.classList.add('black-overlay-cover');
        overlay.classList.remove('black-overlay-right');
        document.body.classList.remove('slide-out-left-to-game');
        document.body.classList.add('game-view');
        setupSprintGame();
        showGameView();
        fillAsciiStrings();
        setTimeout(() => {
          document.body.removeChild(overlay);
          onTransitionEnd();
        }, 1000);
      }, 500);
    }

    function transitionOutOfGame(onTransitionHidden: () => void, isQuit: boolean): void {
      disableResetInput();
      disableBackInputs();
      const isQuitDelay = isQuit ? 0 : 1500;
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
            enableBackInputs();
            enableResetInput();
            document.body.removeChild(overlay);
          }, 1000);
        }, 500);
      }, isQuitDelay);
    }

    async function showDashboard() {
      isGaming.value = false;
      isDashboard.value = true;
      isResultView.value = false;
    }

    function showGameView() {
      isGaming.value = true;
      isDashboard.value = false;
      isResultView.value = false;
    }

    function showResultView() {
      const rawStats: GameStats = getGameStats();
      sprintResultTime.value = rawStats.gameDuration;
      const statBanList = [
        'gameStartTime',
        'gameEndTime',
        'bubbleClearToWin',
        'bubblesLeftToClear',
        'currentCombo',
        'gameDuration',
      ];

      const filteredStats = Object.keys(rawStats)
        .filter(key => !statBanList.includes(key))
        .reduce<Partial<GameStats>>((obj, key) => {
          const keyAsKeyType = key as keyof GameStats;
          obj[keyAsKeyType] = rawStats[keyAsKeyType] as number;
          return obj;
        }, {});

      resultStats.value = filteredStats;

      resetInput.fire = play;
      isGaming.value = false;
      isDashboard.value = false;
      isResultView.value = true;
    }


    const toggleMod = (modAbr: string) => {
      mods.value.forEach((mod) => {
        if ('enabled' in mod && mod.abr === modAbr) {
          mod.enabled = !mod.enabled;
        } else if ('selected' in mod && mod.abr.includes(modAbr)) {
          const currentIndex = mod.abr.findIndex(abr => abr === modAbr);
          const nextIndex = (currentIndex + 1) % mod.abr.length;
          mod.selected = mod.modValues[nextIndex];
        }
      });
      setCookie('mods', JSON.stringify(mods.value), 365);
    };

    const modsComputed = computed(() => mods.value.map(mod => {
      if ('enabled' in mod) {
        return {
          type: 'toggle',
          icon: mod.icon,
          abr: mod.abr,
          title: mod.title,
          enabled: mod.enabled,
        };
      } else {
        return {
          type: 'multi',
          icon: mod.icon,
          index: mod.modValues.indexOf(mod.selected),
          abr: mod.abr[mod.modValues.indexOf(mod.selected)],
          title: mod.title,
          selected: mod.selected,
        };
      }
    }));

    const enabledToggleMods = computed(() => {
      return mods.value
        .filter((mod): mod is ToggleMod => 'enabled' in mod && mod.enabled)
        .map(mod => mod.abr);
    });

    function getIconPath(icon: string) {
      return require(`@/img/mods/${icon}`);
    }

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
      enabledToggleMods,
      goBack,
      resultStats,
      formatFieldValue,
      getFullName,
      getIconPath,
      isResultView,
      splitResultStats,
      sprintResultTime,
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
  background-color: rgb(30, 30, 30);
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

.playMods {
  display: flex;
  flex-direction: row;
  gap: 15px;
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
  display: flex;
  flex-direction: row;
  gap: 15px;
  box-sizing: border-box;
}

.cat-wrapper .cat {
  width: 6vw;
  height: 6vw;
  font-size: 100%;
  cursor: pointer;
  border: none;
  transition: 0.2s;
  background-color: white;
  color: black;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cat-wrapper .cat>div {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}

.cat-wrapper .cat img {
  height: 100%;
  filter: invert(1);
}

.cat-wrapper .cat span {
  position: absolute;
  padding: 0 5px;
  top: 75%;
  left: 10%;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.7);
}

.cat-wrapper .cat:hover {
  opacity: 0.7;
}

.cat-wrapper .cat.active {
  transform: rotate(5deg);
}

.game-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  width: 40%;
  font-size: 24px;
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
  right: 85%;
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

.gameComplete {
  background-color: rgb(30, 30, 30);
  width: 100%;
  height: 100%;
  padding: 15px;
}

.flex-row {
  flex-direction: row;
}

.flex-column {
  flex-direction: column;
}

.slideToRight {
  animation: slideToRight 0.5s forwards;
}

.slideLeftToCenter {
  animation: slideLeftToCenter 0.5s forwards;
}

@keyframes slideToRight {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(110%);
  }
}

@keyframes slideLeftToCenter {
  from {
    transform: translateX(-110%);
  }

  to {
    transform: translateX(0);
  }
}

.page-container {
  position: relative;
}

.move-left {
  position: absolute;
  top: 80px;
  bottom: 80px;
  height: calc(100% - 160px);
  left: 15px;
  width: calc(100% - 30px);
  transform: translateX(-110%);
}

.columns {
  display: flex;
  border-bottom: 1px solid white;
  border-top: 1px solid white;
}

.row {
  display: flex;
  border-bottom: 1px solid white;
  padding: 5px 15px;
  justify-content: space-between;
}

.column:first-of-type {
  border-right: 1px solid white;
}

.column:first-of-type .row:last-of-type {
  border: none;
}

.column {
  flex: 1;
}

.gameComplete .top {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.sprintTime {
  width: 70%;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}

.sprintTime .time {
  font-size: 450%;
}

.sprintTime .diff {
  position: absolute;
  right: 15px;
  bottom: 15px;
}

.gameComplete .top p {
  margin: unset;
}

.gameComplete .top {
  height: 15%;
}

</style>