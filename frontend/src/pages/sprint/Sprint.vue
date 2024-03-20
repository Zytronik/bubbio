<template>
  <section id="template" class="page">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="page-container">

        <div v-if="!isGaming && isDashboard" class="sprintDashboard">

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
import { changeBackgroundTo, formatDateTime, getCookie, goToState, setCookie } from '@/ts/page/page.page-manager';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';
import { computed, onMounted, ref } from 'vue';
import { getGameStats, leaveGame, setupSprintGame, startGame } from '@/ts/game/game.master';
import { bubbleClearToWin, bubblesCleared, bubblesPerSecond, bubblesShot, formatTimeNumberToString, formattedCurrentTime } from '@/ts/game/visuals/game.visuals.stat-display';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import Leaderboard from '@/globalComponents/Leaderboard.vue';
import History from '@/globalComponents/History.vue';
import { GameMode, LeaderboardCategory, SortDirection } from '@/ts/page/page.e-leaderboard';
import { UserData } from '@/ts/page/page.i-userData';
import eventBus from '@/ts/page/page.event-bus';
import { allMods as importedMods } from '@/ts/game/settings/ref/game.settings.ref.all-mods';
import { GameStats } from '@/ts/game/i/game.i.game-stats';
import { backInput, resetInput } from '@/ts/input/input.all-inputs';
import { formatFieldValue, getFullName } from '@/ts/page/page.i.stat-display';
import { MultiMod, ToggleMod } from '@/ts/game/settings/i/game.settings.i.mod';
import { fillAsciiStrings } from '@/ts/game/visuals/game.visuals.ascii';

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
      console
      applyMods();
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
        leaveGame();
        showDashboard();
      }
      if (!isDashboard.value && !isGaming.value) {
        showDashboard();
      }
      document.body.classList.remove('game-view'); //temp
    }

    function play() {
      transitionToGame(() => {
        backInput.fire = goBack;
        startGame();
      });
    }

    function transitionToGame(callback: () => void): void {
      document.body.classList.add('slide-out-left-to-game');
      const overlay = document.createElement('div');
      overlay.className = 'black-overlay-right';
      document.body.appendChild(overlay);
      setTimeout(() => {
        overlay.classList.add('black-overlay-cover');
        overlay.classList.remove('black-overlay-right');
        document.body.classList.remove('slide-out-left-to-game');
        document.body.classList.add('game-view');
        setupSprintGame();
        showGameView();
        fillAsciiStrings();
        setTimeout(() => {
          document.body.removeChild(overlay);
          callback();
        }, 1000);
      }, 500);
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
  padding: 5px;
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
</style>
@/ts/game/settings/ref/game.settings.all-mods