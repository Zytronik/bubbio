<template>
  <section id="template" class="page">
    <MenuBackButtons :buttonData="backButtonData" :specialBehavior="specialBackButtonBehavior" @special-click-event="goBack" />
    <div class="page-wrapper">
      <div class="page-container">

        <div v-if="isDashboard" class="sprintDashboard page-dashboard">
          <div class="left-content">
            <div class="playMods">
              <button class="playButton" @click="play()">Play!</button>
              <div class="cat-wrapper">
                <div class="cat" v-for="mod in modsCheckboxDisplay" :key="mod.abr.toString()"
                  @click="toggleMod(mod.abr)" :class="{ 'active': mod.type === 'toggle' && mod.enabled }">
                  <!-- ToggleMod -->
                  <div v-if="mod.type === 'toggle'">
                    <img v-if="mod.enabled" :src="getModIconPath(mod.icon[0])" alt="Enabled Icon" />
                    <img v-else :src="getModIconPath(mod.icon[1])" alt="Disabled Icon" />
                    <span>{{ mod.title }}</span>
                  </div>
                  <!-- MultiMod -->
                  <div v-else-if="mod.type === 'multi'">
                    <img v-if="mod.index != null" :src="getModIconPath(mod.icon[mod.index])" alt="Enabled Icon" />
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
              <div class="lModsDisplay">Mods: {{ formatFieldValue(JSON.stringify(enabledToggleMods), "mods") }}</div>
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
            <div class="inGameStats">
              <p v-html="playerGameVisuals.statNumbers.formattedCurrentTime.value"></p>
              <p>{{ playerGameVisuals.statNumbers.bubblesCleared }}/{{ playerGameVisuals.statNumbers.bubbleClearToWin }}
              </p>
              <p>{{ playerGameVisuals.statNumbers.bubblesShot }} BPS: {{ playerGameVisuals.statNumbers.bubblesPerSecond
                }}</p>
            </div>
            <Game :playerGameVisuals="playerGameVisuals" :areRef="true" />
          </div>
        </div>

        <div v-if="isResultView" class="gameComplete">
          <div class="top">
            <div class="sprintTime">
              <p v-if="resultStats" class="time">{{ formatTimeNumberToString(resultStats.gameDuration ?? 0) }}</p>
              <p class="diff" v-if="diffToPb">Diff to pb: {{ formatTimeNumberToString(diffToPb ?? 0) }}</p>
              <p class="pb" v-if="diffToPb === 0">Personal Best!</p>
            </div>
            <button class="retry" @click="play()">Retry</button>
          </div>

          <LineChart v-if="resultStats" :data="resultStats.bpsGraph ?? []" />

          <div v-if="resultStats">
            <div class="columns">
              <div class="column">
                <div class="row" key="bubblesCleared">
                  <div class="col">{{ getFullName("bubblesCleared") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.bubblesCleared ?? '', "bubblesCleared") }}</div>
                </div>
                <div class="row" key="bubblesShot">
                  <div class="col">{{ getFullName("bubblesShot") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.bubblesShot ?? '', "bubblesShot") }}</div>
                </div>
                <div class="row" key="bubblesPerSecond">
                  <div class="col">{{ getFullName("bubblesPerSecond") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.bubblesPerSecond ?? '', "bubblesPerSecond") }}</div>
                </div>
                <div class="row" key="clear3">
                  <div class="col">{{ getFullName("clear3") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.clear3 ?? '', "clear3") }}</div>
                </div>
                <div class="row" key="clear4">
                  <div class="col">{{ getFullName("clear4") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.clear4 ?? '', "clear4") }}</div>
                </div>
                <div class="row" key="clear5">
                  <div class="col">{{ getFullName("clear5") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.clear5 ?? '', "clear5") }}</div>
                </div>
                <div class="row" key="clear3wb">
                  <div class="col">{{ getFullName("clear3wb") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.clear3wb ?? '', "clear3wb") }}</div>
                </div>
              </div>
              <div class="column">
                <div class="row" key="clear4wb">
                  <div class="col">{{ getFullName("clear4wb") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.clear4wb ?? '', "clear4wb") }}</div>
                </div>
                <div class="row" key="clear5wb">
                  <div class="col">{{ getFullName("clear5wb") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.clear5wb ?? '', "clear5wb") }}</div>
                </div>
                <div class="row" key="highestBubbleClear">
                  <div class="col">{{ getFullName("highestBubbleClear") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.highestBubbleClear ?? '', "highestBubbleClear") }}
                  </div>
                </div>
                <div class="row" key="wallBounces">
                  <div class="col">{{ getFullName("wallBounces") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.wallBounces ?? '', "wallBounces") }}</div>
                </div>
                <div class="row" key="wallBounceClears">
                  <div class="col">{{ getFullName("wallBounceClears") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.wallBounceClears ?? '', "wallBounceClears") }}</div>
                </div>
                <div class="row" key="highestCombo">
                  <div class="col">{{ getFullName("highestCombo") }}</div>
                  <div class="col">{{ formatFieldValue(resultStats.highestCombo ?? '', "highestCombo") }}</div>
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
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { formatDateTime, getCookie, setCookie } from '@/ts/page/page.page-utils';
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { ComputedRef, computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { playerGameInstance, leaveGame, playerGameVisuals, setupSprintGame, startGame } from '@/ts/game/game.master';
import { formatTimeNumberToString } from '@/ts/game/visuals/game.visuals.stat-display';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import Leaderboard from '@/globalComponents/Leaderboard.vue';
import History from '@/globalComponents/History.vue';
import { GameMode, LeaderboardCategory, SortDirection } from '@/ts/page/e/page.e-leaderboard';
import { UserData } from '@/ts/page/i/page.i.user-data';
import eventBus from '@/ts/page/page.event-bus';
import { GameStats } from '@/ts/game/i/game.i.game-stats';
import { backInput, resetInput } from '@/ts/input/input.all-inputs';
import { formatFieldValue, getFullName } from '@/ts/page/i/page.i.stat-display';
import { fillAsciiStrings } from '@/ts/game/visuals/game.visuals.ascii';
import { MultiMod, ToggleMod } from '@/ts/game/settings/ref/i/game.settings.ref.i.mod';
import { allMods } from '@/ts/game/settings/ref/game.settings.ref.all-mods';
import { triggerConfettiAnimation } from '@/ts/page/page.visuals';
import { getDifferenceToPB } from '@/ts/page/page.page-requests';
import { convertModToModDetail, getModIconPath } from '@/ts/page/page.mods';
import { ModDetail } from '@/ts/page/i/page.i.mod-detail';
import LineChart from '@/globalComponents/LineChart.vue';
import { disableBackInputs, disableResetInput, enableBackInputs, enableResetInput } from '@/ts/input/input.input-manager';

export default {
  name: 'SprintPage',
  components: { Game, MenuBackButtons, Leaderboard, History, LineChart },
  data() {
    return {
      currentLeaderboard: 'Global',
      leaderboardTabs: ['Global', 'National'],
    };
  },
  setup() {
    const mods = ref<(ToggleMod | MultiMod)[]>(allMods);
    const specialBackButtonBehavior = ref(false);
    const isGaming = ref<boolean>(false);
    const isDashboard = ref<boolean>(true);
    const isResultView = ref<boolean>(false);
    const resultStats = ref<Partial<GameStats>>();
    const userData: UserData | null = eventBus.getUserData();
    const isGuestString = sessionStorage.getItem('isGuest');
    const isGuest = Boolean(isGuestString && isGuestString.toLowerCase() === 'true');
    const backInputOnLoad = ref<() => void>(() => "");
    const sprintResultTime = ref<number>(0);
    const diffToPb = ref<number | undefined>(0);
    const backButtonData = ref([
      { pageState: PAGE_STATE.soloMenu, iconSrc: require('@/img/icons/sprint.png'), disabled: false },
    ]);

    onUnmounted(() => {
      eventBus.off("sprintVictory");
    });

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
      showDashboard();
      isResultView.value = true;
      await nextTick(); // if i dont do this, dashboard is undefined
      const dashboard = document.querySelector('.sprintDashboard') as HTMLElement;
      const resultScreen = document.querySelector('.gameComplete') as HTMLElement;
      const container = document.querySelector('.page-container') as HTMLElement;
      container.classList.add('flex-row'); //add flex-row to container
      dashboard.classList.add('moveResultScreen-left'); //position dashboard to the left
      resultScreen.classList.add('slideToRight'); //slide result screen to the left
      dashboard.classList.add('slideLeftToCenter'); //slide dashboard to the left
      setTimeout(() => {
        leaveGame();
        resultScreen.classList.remove('slideToRight'); //reset styles
        isResultView.value = false; //remove result screen
        dashboard.classList.remove('moveResultScreen-left'); //reset styles
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
            resetInput.fire = play;
            document.body.removeChild(overlay);
          }, 1000);
        }, 500);
      }, isQuitDelay);
    }

    async function showDashboard() {
      isGaming.value = false;
      isDashboard.value = true;
      isResultView.value = false;
      specialBackButtonBehavior.value = false;
    }

    function showGameView() {
      isGaming.value = true;
      isDashboard.value = false;
      isResultView.value = false;
      specialBackButtonBehavior.value = false;
    }

    async function showResultView() {
      resultStats.value = playerGameInstance.stats;
      if (resultStats.value.gameDuration !== undefined) {
        diffToPb.value = await getDifferenceToPB(resultStats.value.gameDuration, enabledToggleMods.value);
      }
      if (diffToPb.value === 0) {
        triggerConfettiAnimation(".page-container");
      }
      specialBackButtonBehavior.value = true;
      isGaming.value = false;
      isDashboard.value = false;
      isResultView.value = true;
    }

    function toggleMod(modAbr: string) {
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
    }

    const modsCheckboxDisplay = computed(() => mods.value.map(mod => {
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

    const enabledToggleMods: ComputedRef<ModDetail[]> = computed(() => {
      return convertModToModDetail(mods.value);
    });

    return {
      playerGameVisuals,
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
      modsCheckboxDisplay,
      enabledToggleMods,
      goBack,
      resultStats,
      formatFieldValue,
      getFullName,
      getModIconPath,
      isResultView,
      sprintResultTime,
      diffToPb,
      convertModToModDetail,
      LineChart,
      specialBackButtonBehavior,
    };
  },
};
</script>

<style scoped>
.back-buttons::before {
  background: linear-gradient(45deg, rgba(96, 221, 43, 1) 0%, rgba(198, 63, 135, 1) 100%);
}

.playMods {
  display: flex;
  flex-direction: row;
  gap: 15px;
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

.inGame {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.gameComplete {
  background-color: rgb(30, 30, 30);
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
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

.sprintTime .diff,
.sprintTime .pb {
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

.lModsDisplay {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.l-tab-buttons {
  position: relative;
}
</style>