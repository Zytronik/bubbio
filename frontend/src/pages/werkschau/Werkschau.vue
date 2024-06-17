<template>
  <section id="werkschau" class="page">
    <div class="page-wrapper">
      <div class="page-container">
        <div class="werkschau-header">
          <h1>
            <span class="text-noWhiteSpaces">W</span>
            <span class="text-noWhiteSpaces">erkschau</span>
            <span class="text-noWhiteSpaces">R</span>
            <span class="text-noWhiteSpaces">anking</span>
          </h1>
          <div class="title-bg"></div>
          <div class="top"><span class="text-noWhiteSpaces">T</span><span class="text-noWhiteSpaces">op 100</span></div>
          <div class="sprint-title">
            <h2><span class="text-noWhiteSpaces">S</span><span class="text-noWhiteSpaces">rint</span></h2>
          </div>
        </div>
        <div class="werkschau-content">
          <div class="werkschau-content-wrapper">
            <div class="leaderboard-wrapper">
              <div v-if="loading" class="loader"></div>
              <div class="leaderboard" v-if="filteredLeaderboard.length">
                <div class="head">
                  <div class="row">
                    <div class="cell">
                      <p>Rank</p>
                    </div>
                    <div class="cell">
                      <p>User</p>
                    </div>
                    <div class="cell">
                      <p>Duration</p>
                    </div>
                    <div class="cell">
                      <p>Submitted At</p>
                    </div>
                    <div class="cell">
                      <p>B. Cleared</p>
                    </div>
                    <div class="cell">
                      <p>B. Shot</p>
                    </div>
                    <div class="cell">
                      <p>B. Per Sec.</p>
                    </div>
                    <div class="cell">
                      <p>Highest Clear</p>
                    </div>
                  </div>
                </div>
                <div class="body">
                  <div class="shape hidden"></div>
                  <div class="spacer hidden"></div>
                  <div class="row" v-for="(entry, index) in filteredLeaderboard" :key="index" :data-id="entry.id">
                    <div class="cell">
                      <p>#{{ index + 1 }}</p>
                    </div>
                    <div class="cell">
                      <div class="user-info">
                        <img :src="entry.user.pbUrl ? entry.user.pbUrl : getDefaultProfilePbURL()" alt="flag" width="40"
                          height="40" />
                        <p>{{ entry.user.username.toUpperCase() }}</p>
                      </div>
                    </div>
                    <div class="cell">
                      <p>{{ formatFieldValue(entry.gameDuration, "gameDuration") }}</p>
                    </div>
                    <div class="cell">
                      <p>{{ formatFieldValue(entry.submittedAt, "submittedAt") }}</p>
                    </div>
                    <div class="cell">
                      <p>{{ formatFieldValue(entry.bubblesCleared, "bubblesCleared") }}</p>
                    </div>
                    <div class="cell">
                      <p>{{ formatFieldValue(entry.bubblesShot, "bubblesShot") }}</p>
                    </div>
                    <div class="cell">
                      <p>{{ formatFieldValue(entry.bubblesPerSecond, "bubblesPerSecond") }}</p>
                    </div>
                    <div class="cell">
                      <p>{{ formatFieldValue(entry.highestBubbleClear, "highestBubbleClear") }}</p>
                    </div>
                  </div>
                  <div class="spacer hidden"></div>
                </div>
              </div>
              <p class="no-entries" v-if="noEntries && !loading">No entries found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script lang="ts">
import state from '@/ts/networking/networking.client-websocket';
import { getDefaultProfilePbURL } from '@/ts/networking/paths';
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { formatFieldValue, getFullName } from '@/ts/page/i/page.i.stat-display';
import { addGameViewStyles, removeGameViewStyles } from '@/ts/page/page.css-transitions';
import { goToState } from '@/ts/page/page.page-manager';
import { getWerkschauLeaderboard } from '@/ts/page/page.page-requests';
import { computed, onMounted, onUnmounted, ref } from 'vue';

interface LeaderboardEntry {
  user: {
    username: string;
    pbUrl: string;
  };
  userId: number;
  id: number;
  gameDuration: number;
  submittedAt: number;
  bubblesCleared: number;
  bubblesShot: number;
  bubblesPerSecond: number;
  highestBubbleClear: number;
}

interface NewRecord {
  leaderboard: LeaderboardEntry[];
  currentSprintId: number;
}

export default {
  name: 'WerkschauPage',
  setup() {
    const leaderboard = ref<LeaderboardEntry[]>([]);
    const loading = ref(false);
    const noEntries = ref(false);

    const filteredLeaderboard = computed(() => {
      return leaderboard.value.map(entry => {
        const { userId, ...rest } = entry;
        return rest;
      });
    });

    onMounted(async () => {
      loading.value = true;
      try {
        const result = await getWerkschauLeaderboard();
        leaderboard.value = result;
        noEntries.value = result.length === 0;
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
        noEntries.value = true;
      } finally {
        loading.value = false;
      }
      addGameViewStyles();
      mountSocketListeners();
    });

    onUnmounted(() => {
      removeWerkschauFromUrl();
      removeGameViewStyles();
      unmountSocketListeners();
    });

    function mountSocketListeners() {
      if (state.socket) {
        state.socket.on('newWerkschauRecord', (newRecord: NewRecord) => {
          newWerkschauRecord(newRecord);
        });
      }
    }

    function unmountSocketListeners() {
      if (state.socket) {
        state.socket.off('newWerkschauRecord');
      }
    }

    function newWerkschauRecord(newRecord: NewRecord) {
      loading.value = true;
      //remove me class from previous record
      const previousRecordElement = document.querySelector('.row.me');
      if (previousRecordElement) {
        previousRecordElement.classList.remove('me');
      }
      //update leaderboard
      leaderboard.value = newRecord.leaderboard;
      //add me class to new record
      setTimeout(() => {
        const newRecordElement = document.querySelector(`.row[data-id="${newRecord.currentSprintId}"]`);
        if (newRecordElement) {
          newRecordElement.classList.add('me');
          //scroll werkschau-content-wrapper so that new record is in the center
          newRecordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

          setTimeout(() => {
            newRecordElement.classList.remove('me');
          }, 15000);
        }
        loading.value = false;
      }, 1000);
    }

    function removeWerkschauFromUrl() {
      const currentUrl = window.location.pathname;
      if (currentUrl.includes('/werkschau')) {
        history.replaceState(null, '', currentUrl.replace('/werkschau', ''));
      }
    }

    return {
      goToState,
      PAGE_STATE,
      leaderboard,
      getFullName,
      loading,
      noEntries,
      filteredLeaderboard,
      formatFieldValue,
      getDefaultProfilePbURL,
    };
  },
};
</script>


<style scoped>
#werkschau {
  --werkschau-color: rgb(253, 82, 0);
  --werkschau-bg-color: rgba(253, 82, 0, 0.5);
  background-color: rgb(25, 25, 25);
}

.top {
  position: fixed;
  top: 12%;
  z-index: 1;
  right: 9%;
  font-size: 4em;
  margin: 0;
  display: flex;
  align-items: flex-end;
  text-transform: uppercase;
  font-style: italic;
  position: fixed;
  font-weight: bold;
  transform: rotate(18deg);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1) rotate(18deg);
  }

  50% {
    transform: scale(1.1) rotate(18deg);
  }

  100% {
    transform: scale(1) rotate(18deg);
  }
}

.sprint-title {
    position: fixed;
    right: 0%;
    bottom: 20%;
    transform: rotate(90deg) skewY(-10deg);
    text-transform: uppercase;
    z-index: 10;
}

.sprint-title h2 {
    margin: 0;
    font-size: 7em;
    display: flex;
    align-items: flex-end;
}

.sprint-title span:first-of-type {
    font-size: 150%;
}

h1 {
  font-size: 6.5em;
  margin: 0;
  display: flex;
  align-items: flex-end;
  text-transform: uppercase;
  font-style: italic;
  position: fixed;
  top: 6%;
}

.title-bg {
  content: "";
  position: fixed;
  top: 0%;
  left: 0;
  z-index: -2;
  border-right: 65vw solid transparent;
  border-bottom: 3.5em solid var(--werkschau-color);
  height: 9%;
  width: 10%;
}

h1>span:nth-of-type(1),
h1>span:nth-of-type(3),
.top>span:nth-of-type(1) {
  font-size: 150%;
}

h1>span:nth-of-type(3) {
  margin-left: 0.3em;
}

h1 {
  background: linear-gradient(to right, #e7e7e7 0, white 10%, #e7e7e7 20%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 5s linear infinite;
  z-index: 1;
}

@keyframes shine {
  0% {
    background-position: 0;
  }

  50% {
    background-position: 60vw;
  }

  100% {
    background-position: 60vw;
  }
}

.leaderboard {
  height: 100%;
  width: 100%;
}

.leaderboard-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

p {
  margin: unset;
}

.me {
  background-color: rgba(149, 149, 149, 0.3);
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    background-color: rgba(149, 149, 149, 0.3);
  }

  50% {
    background-color: var(--werkschau-bg-color);
  }

  100% {
    background-color: rgba(149, 149, 149, 0.3);
  }
}

.row {
  display: flex;
  flex-direction: row;
  text-align: center;
  transition: 0.2s;
}

.head {
  font-size: 80%;
  font-style: italic;
  background-color: hsla(0, 0%, 58%, .3);
}

.head .row .cell:nth-of-type(1),
.head .row .cell:nth-of-type(2) {
  visibility: hidden;
  pointer-events: none;
  opacity: 0;
}

.row .cell:first-of-type {
  flex: 0.3;
  padding: 0 10px;
  text-align: left;
}

.row .cell:nth-of-type(2) {
  flex: 1.2;
  text-align: left;
  z-index: 1;
}

.row .cell:nth-of-type(4) {
  flex: 1.3;
}

.row:nth-of-type(3) .cell:first-of-type p {
  color: rgb(144, 122, 0);
}

.row:nth-of-type(4) .cell:first-of-type p {
  color: rgb(135, 135, 135);
}

.row:nth-of-type(5) .cell:first-of-type p {
  color: #CD7F32;
}

.row:nth-of-type(6) {
  border-top: 1px solid white;
}

.cell {
  flex: 1;
  padding: 15px 0px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  z-index: 1;
}

.cell>p {
  width: 100%;
}

.user-info img {
  object-fit: cover;
}

.cell:last-of-type>p {
  padding-right: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.werkschau-content {
  height: 80%;
  bottom: 0%;
  left: 5%;
  width: 80%;
  position: fixed;
  transform: skewX(10deg);
  padding-bottom: var(--menu-btn-border-width);
  box-sizing: border-box;
  padding-top: var(--menu-btn-border-width);
  padding-right: var(--menu-btn-border-width);
}

.werkschau-content::after {
  content: "";
  background-color: #e8eeeb;
  position: absolute;
  right: 0;
  top: 0;
  width: 200%;
  height: 200%;
  z-index: -1;
  border: var(--menu-btn-border-width) solid #000;
}

.werkschau-content::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  border-bottom: 25vw solid transparent;
  border-left: 50vh solid transparent;
  border-top: var(--menu-btn-border-width) solid #000;
  border-right: var(--menu-btn-border-width) solid #000;
  height: 15%;
  width: 20%;
  border-top: var(--menu-btn-border-width) solid var(--werkschau-color);
  border-right: var(--menu-btn-border-width) solid var(--werkschau-color);
}

.werkschau-content-wrapper {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  color: #000;
}

.leaderboard-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.no-entries {
  font-size: 1.6em;
  text-transform: uppercase;
  font-weight: bold;
}

.no-entries,
.loader {
  transform: skewX(-10deg);
}

.leaderboard .cell {
  height: 70px;
  font-size: 1.6em;
  text-transform: uppercase;
  font-weight: bold;
}

.leaderboard .row:nth-of-type(6) {
  border-top: 5px solid transparent;
  position: relative;
}

.leaderboard .row:nth-of-type(6)::after {
  content: "";
  position: absolute;
  top: -5px;
  right: 0;
  border-left: 50vw solid transparent;
  border-top: 5px solid black;
  height: 100%;
  width: 20%;
}

.leaderboard .cell,
.history .cell {
  transform: skewX(-10deg);
}

.leaderboard .row div:nth-child(3) {
  color: var(--werkschau-color);
}

.history .body .row div:nth-child(3) {
  color: var(--werkschau-color);
}

.history .row div:nth-child(2) {
  flex: 0.6;
}
</style>