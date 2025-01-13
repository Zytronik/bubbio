<template>
  <section id="matchmakingSimulation" class="page">
    <div class="page-wrapper">
      <div class="page-container">
        <button @click="goToState(PAGE_STATE.multiMenu)" class="back-button">Back</button>
        <button @click="resetSimulation" class="back-button">Reset</button>
        <button @click="sortUsersByRating" class="back-button">Sort Users</button>
        <h1>Matchmaking Simulation <span>(Speed x{{ speedFactor }})</span></h1>

        <div class="row">
          <div class="settings">
            <h2>Settings</h2>
            <div class="settings-wrapper">
              <p><span>Startwert für den akzeptablen Skill Gap:</span> {{ mmSettings?.startGap }}</p>
              <p v-if="mmSettings?.gapIncreaseInterval"><span>Zeit in Millisekunden, nach der der Skill Gap erhöht
                  wird:</span> {{
                    mmSettings?.gapIncreaseInterval * speedFactor }}</p>
              <p v-if="mmSettings?.matchmakingIntervalTime"><span>Zeit in Millisekunden, nach der Matchmaking Funktion
                  ausgeführt wird:</span> {{
                    mmSettings.matchmakingIntervalTime * speedFactor }}</p>
              <p><span>Wert für erhöhung des Skill Gaps:</span> {{ mmSettings?.gapIncreaseAmount }}</p>
              <p><span>Minimale Erhöhung des Skill Gaps:</span> {{ mmSettings?.minGapIncreaseAmount }}</p>
              <p><span>Maximale Erweiterung des Skill Gaps:</span> {{ mmSettings?.maxGap }}</p>
            </div>
          </div>
        </div>

        <div class="row">

          <div class="column">
            <h2>Not in Queue</h2>
            <div class="button-wrapper">
              <button @click="createAddUser">Create & Add 1 User</button>
              <button @click="createAddMultipleUsers">Create & Add {{ amountOfMultipleUsers }} Users</button>
            </div>
            <div class="scrollable">
              <div v-for="(user, index) in users" :key="'not-in-queue-' + index" class="user">
                <p class="username">{{ user.name }}</p>
                <p class="rating"><span>Rating: </span>{{ user.rating }}<span>±{{ user.ratingDeviation }}</span></p>
                <p class="queueAmount"><span>Queued: </span> {{ user.amountOfQueues }}/{{ user.maxAmountOfQueues }}</p>
                <!-- <p class="startRDev"><span>Start RD: </span> {{ user.startDeviation }}</p> -->
              </div>
            </div>
          </div>

          <div class=" column">
            <h2>In Queue</h2>
            <div class="scrollable">
              <div v-for="(user, index) in queue" :key="'in-queue-' + index" class="user">
                <p class="username">{{ user.name }}</p>
                <p class="rating"><span>Rating: </span>{{ user.rating }}<span>±{{ user.ratingDeviation }}</span></p>
                <p class="queueAmount"><span>Queued: </span> {{ user.amountOfQueues }}/{{ user.maxAmountOfQueues }}</p>
              </div>
              <p v-if="queue.length === 0">No users in queue</p>
            </div>
          </div>

          <div class="column">
            <h2>Matched</h2>
            <div class="scrollable">
              <div v-for="(match, index) in matches" :key="'matched-' + index" class="match">
                <div class="user" :class="{ 'won': match.user1.hasWon, 'lost': match.user1.hasLost }">
                  <p class="username">{{ match.user1.name }}</p>
                  <p class="rating"><span>Rating: </span>{{ match.user1.rating }}<span>±{{ match.user1.ratingDeviation
                      }}</span></p>
                  <p class="queueAmount"><span>Queued: </span> {{ match.user1.amountOfQueues }}/{{
                    match.user1.maxAmountOfQueues }}</p>
                  <p class="time"><span>Waiting Time: </span>{{
                    millisToMinutesAndSeconds(match.user1.waitingTime * speedFactor) ?? 0
                  }}
                  </p>
                </div>
                <span>VS</span>
                <div class="user" :class="{ 'won': match.user2.hasWon, 'lost': match.user2.hasLost }">
                  <p class="username">{{ match.user2.name }}</p>
                  <p class="rating"><span>Rating: </span>{{ match.user2.rating }}<span>±{{ match.user2.ratingDeviation
                      }}</span></p>
                  <p class="queueAmount"><span>Queued: </span> {{ match.user2.amountOfQueues }}/{{
                    match.user2.maxAmountOfQueues }}</p>
                  <p class="time"><span>Waiting Time: </span>{{
                    millisToMinutesAndSeconds(match.user2.waitingTime * speedFactor) ?? 0
                  }}
                  </p>
                </div>
              </div>
              <p v-if="matches.length === 0">No matches found</p>
            </div>
          </div>

        </div>

        <div class="row">
          <div class="column col-2 statistics">
            <h2>Statistics</h2>
            <p><span>Found Matches: </span>{{ statistics.matchCount }}</p>
            <div class="multi-stat">
              <p><span>Average Waiting Time: </span>{{ millisToMinutesAndSeconds(statistics.averageWaitingTime *
                speedFactor) ?? 0 }}</p>
              <p><span>Highest Waiting Time: </span>{{ millisToMinutesAndSeconds(statistics.highestWaitingTime *
                speedFactor) ?? 0 }}</p>
              <p><span>Lowest Waiting Time: </span>{{ millisToMinutesAndSeconds(statistics.lowestWaitingTime *
                speedFactor) ?? 0 }}</p>
            </div>
            <div class="multi-stat">
              <p><span>Average Rating Difference: </span>{{ statistics.averageRatingDifference ?? 0 }}</p>
              <p><span>Highest Rating Difference: </span>{{ statistics.highestRatingDifference ?? 0 }}</p>
              <p><span>Lowest Rating Difference: </span>{{ isFinite(statistics.lowestRatingDifference) ?
                statistics.lowestRatingDifference : "∞" }}</p>
            </div>
          </div>
          <div class="column col-2">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>



<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { addGameViewStyles, removeGameViewStyles } from '@/ts/page/page.css-transitions';
import state from '@/ts/networking/networking.client-websocket';
import { Chart } from 'chart.js';
import debounce from 'debounce';

interface User {
  name: string;
  rating: number;
  ratingDeviation: number;
  volatility: number;
  waitingTime: number;
  hasWon?: boolean;
  hasLost?: boolean;
  amountOfQueues: number;
  maxAmountOfQueues: number;
  startDeviation: number;
  loopsInQueue?: number;
}

interface MmSettings {
  speedFactor: number;
  startGap: number;
  gapIncreaseInterval: number;
  matchmakingIntervalTime: number;
  minGapIncreaseAmount: number;
  gapIncreaseAmount: number;
  maxGap: number;
}

interface MatchmakingQueue {
  [name: string]: UserMatchmakingData;
}

interface UserMatchmakingData {
  glicko: number;
  searchStart: number;
}

interface Match {
  user1: User;
  user2: User;
}

export default defineComponent({
  name: 'MatchmakingSimulation',
  setup() {
    const users = ref<User[]>([]);
    const queue = ref<User[]>([]);
    const matches = ref<Match[]>([]);
    const currentId = ref(1);
    const speedFactor = ref(100);
    const mmSettings = ref<MmSettings>()
    const amountOfMultipleUsers = ref(100);

    onMounted(() => {
      changeBackgroundTo("black");
      addGameViewStyles();
      mountSockets();
    });

    onUnmounted(() => {
      removeGameViewStyles();
      unmountSockets();
      if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
      }
    });

    function unmountSockets() {
      if (state.socket) {
        state.socket.emit('playerLeftMmSimVue');
        state.socket.off('queueUpdate');
        state.socket.off('matchFoundUpdate');
        state.socket.off('matchResult');
        state.socket.off('ratingsUpdate');
        state.socket.off('mMSettings');
      }
    }

    function mountSockets() {
      if (state.socket) {
        state.socket.emit('playerJoinedMmSimVue');
      }

      if (state.socket) {
        state.socket.on('queueUpdate', (q: MatchmakingQueue) => {
          for (const username in q) {
            let user = getUserByName(username)
            if (user) {
              users.value = users.value.filter((u) => u.name !== username);
              queue.value.push(user);
            }
          }
        });

        state.socket.on('matchFoundUpdate', (match: User[]) => {
          let user1 = queue.value.find(user => user.name === match[0].name);
          let user2 = queue.value.find(user => user.name === match[1].name);
          if (user1 && user2 && mmSettings.value && match[0].loopsInQueue && match[1].loopsInQueue) {
            user1.waitingTime = Math.floor((match[0].loopsInQueue - 1) * mmSettings.value.matchmakingIntervalTime);
            user2.waitingTime = Math.floor((match[1].loopsInQueue - 1) * mmSettings.value.matchmakingIntervalTime);
            queue.value = queue.value.filter(user => user.name !== user1.name && user.name !== user2.name);
            matches.value.push({ user1, user2 });
            updateStatistics(user1, user2);
          }
        });

        state.socket.on('matchResult', (matchResult: User[]) => {
          let winner = matchResult[0];
          let loser = matchResult[1];
          let winnerIndex = matches.value.findIndex(match => match.user1.name === winner.name || match.user2.name === winner.name);
          let loserIndex = matches.value.findIndex(match => match.user1.name === loser.name || match.user2.name === loser.name);
          if (winnerIndex !== -1 && loserIndex !== -1) {
            matches.value[winnerIndex].user1.hasWon = matches.value[winnerIndex].user1.name === winner.name;
            matches.value[winnerIndex].user2.hasWon = matches.value[winnerIndex].user2.name === winner.name;
            matches.value[loserIndex].user1.hasLost = matches.value[loserIndex].user1.name === loser.name;
            matches.value[loserIndex].user2.hasLost = matches.value[loserIndex].user2.name === loser.name;
          }
        });

        state.socket.on('mMSettings', (settings: MmSettings) => {
          mmSettings.value = settings;
        });

        state.socket.on('ratingsUpdate', (ratingUpdate: User[]) => {
          let winner = ratingUpdate[0];
          let loser = ratingUpdate[1];
          const maxDelay = 600000;
          const minDelay = 120000;
          const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

          // Wait for x seconds
          setTimeout(() => {
            // Add both users to users array if they are not already in there
            [winner, loser].forEach(user => {
              if (!users.value.some(u => u.name === user.name)) {
                users.value.push({
                  ...user,
                  waitingTime: 0,  // Reset or assign appropriate waiting time
                  hasWon: undefined,       // Reset or assign win/loss status
                  hasLost: undefined
                });
              }
            });

            // Remove both users from matches array
            matches.value = matches.value.filter(match =>
              match.user1.name !== winner.name && match.user1.name !== loser.name &&
              match.user2.name !== winner.name && match.user2.name !== loser.name
            );

            // After users are added to users array and removed from matches array, update the ratings
            users.value.forEach(user => {
              if (user.name === winner.name) {
                user.rating = formatRating(winner.rating);
                user.ratingDeviation = formatRating(winner.ratingDeviation);
                user.volatility = formatVolatity(winner.volatility);
              }
              if (user.name === loser.name) {
                user.rating = formatRating(loser.rating);
                user.ratingDeviation = formatRating(loser.ratingDeviation);
                user.volatility = formatVolatity(loser.volatility);
              }
            });
            addUserToQueue(winner);
            addUserToQueue(loser);

          }, randomDelay / speedFactor.value);
        });
      }
    }

    function createUser() {
      const name = `tester-${currentId.value}`;
      currentId.value++;
      const rating = 1500;
      const ratingDeviation = 250;
      const volatility = 0.06;
      const waitingTime = 0;
      const amountOfQueues = 0;
      const minMaxAmountOfQueues = 10;
      const maxMaxAmountOfQueues = 20;
      const maxAmountOfQueues = Math.floor(Math.random() * (maxMaxAmountOfQueues - minMaxAmountOfQueues + 1)) + minMaxAmountOfQueues;

      /* const minRatingDeviation = 60;
      const maxRatingDeviation = 250;
      const ratingDeviation = formatRating(Math.random() * (maxRatingDeviation - minRatingDeviation + 1)) + minRatingDeviation;
 */
      const newUser: User = { name, rating, ratingDeviation, volatility, amountOfQueues, maxAmountOfQueues, startDeviation: ratingDeviation, waitingTime };
      users.value.push(newUser);
      return newUser;
    }

    function createAddMultipleUsers() {
      for (let i = 0; i < amountOfMultipleUsers.value; i++) {
        const user = createUser();
        addUserToQueue(user);
      }
    }

    function createAddUser() {
      const user = createUser();
      addUserToQueue(user);
    }

    function addUserToQueue(user: User) {
      debouncedUpdateChart();
      if (user.amountOfQueues >= user.maxAmountOfQueues) return;
      user.amountOfQueues++;

      const minDelay = 5000;
      const maxDelay = 60000;
      const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      setTimeout(() => {
        if (state.socket) {
          state.socket.emit('addUserToQueue', user);
        }
      }, randomDelay / speedFactor.value);
    }

    function formatRating(rating: number) {
      return Math.round(rating);
    }

    function formatVolatity(volatility: number) {
      return Math.round(volatility * 1000) / 1000;
    }

    function getUserByName(name: string) {
      return users.value.find(user => user.name === name);
    }

    function resetSimulation() {
      users.value.length = 0;
      queue.value.length = 0;
      matches.value.length = 0;
      statistics.value = {
        totalWaitingTime: 0,
        totalRatingDifference: 0,
        matchCount: 0,
        highestWaitingTime: 0,
        lowestWaitingTime: Infinity,
        averageWaitingTime: 0,
        highestRatingDifference: 0,
        lowestRatingDifference: Infinity,
        averageRatingDifference: 0,
      }
      currentId.value = 1;
      if (state.socket) {
        state.socket.emit('resetMatchmakingSimulation');
      }
      debouncedUpdateChart();
    }

    function millisToMinutesAndSeconds(millis: number) {
      if (millis === Infinity) return "∞";
      let minutes: number = Math.floor(millis / 60000);
      let seconds: number = parseInt(((millis % 60000) / 1000).toFixed(0));
      return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    function sortUsersByRating() {
      users.value.sort((a, b) => b.rating - a.rating);
    }

    const statistics = ref({
      totalWaitingTime: 0,
      totalRatingDifference: 0,
      matchCount: 0,
      highestWaitingTime: 0,
      lowestWaitingTime: Infinity,
      averageWaitingTime: 0,
      highestRatingDifference: 0,
      lowestRatingDifference: Infinity,
      averageRatingDifference: 0,
    });

    function updateStatistics(user1: User, user2: User) {
      const waitingTime = (user1.waitingTime ?? 0) + (user2.waitingTime ?? 0);
      const ratingDifference = Math.abs(user1.rating - user2.rating);
      statistics.value.totalWaitingTime += waitingTime;
      statistics.value.totalRatingDifference += ratingDifference;
      statistics.value.matchCount++;
      statistics.value.averageWaitingTime = statistics.value.totalWaitingTime / statistics.value.matchCount / 2;
      statistics.value.averageRatingDifference = Math.round(statistics.value.totalRatingDifference / statistics.value.matchCount);
      statistics.value.highestWaitingTime = Math.max(statistics.value.highestWaitingTime, Math.max((user1.waitingTime ?? 0), (user2.waitingTime ?? 0)));
      statistics.value.lowestWaitingTime = Math.min(statistics.value.lowestWaitingTime, Math.min((user1.waitingTime ?? 0), (user2.waitingTime ?? 0)));
      statistics.value.highestRatingDifference = Math.max(statistics.value.highestRatingDifference, ratingDifference);
      statistics.value.lowestRatingDifference = Math.min(statistics.value.lowestRatingDifference, ratingDifference);
    }

    // eslint-disable-next-line
    const chartCanvas = ref<any>(null);
    // eslint-disable-next-line
    const chartInstance = ref<any>(null);

    const debouncedUpdateChart = debounce(updateChart, 10000);

    function updateChart() {
      if (!chartCanvas.value || !chartCanvas.value.getContext) {
        console.error("Canvas element is not available or not ready.");
        return;
      }

      const ratingRanges = [
        { min: 0, max: 900, label: '0-900' },
        { min: 901, max: 1000, label: '901-1000' },
        { min: 1000, max: 1050, label: '1000-1050' },
        { min: 1051, max: 1100, label: '1051-1100' },
        { min: 1101, max: 1150, label: '1101-1150' },
        { min: 1151, max: 1200, label: '1151-1200' },
        { min: 1201, max: 1250, label: '1201-1250' },
        { min: 1251, max: 1300, label: '1251-1300' },
        { min: 1301, max: 1350, label: '1301-1350' },
        { min: 1351, max: 1400, label: '1351-1400' },
        { min: 1401, max: 1450, label: '1401-1450' },
        { min: 1451, max: 1500, label: '1451-1500' },
        { min: 1501, max: 1550, label: '1501-1550' },
        { min: 1551, max: 1600, label: '1551-1600' },
        { min: 1601, max: 1650, label: '1601-1650' },
        { min: 1651, max: 1700, label: '1651-1700' },
        { min: 1701, max: 1750, label: '1701-1750' },
        { min: 1751, max: 1800, label: '1751-1800' },
        { min: 1801, max: 1850, label: '1801-1850' },
        { min: 1851, max: 1900, label: '1851-1900' },
        { min: 1901, max: 1950, label: '1901-1950' },
        { min: 1951, max: 2000, label: '1951-2000' },
        { min: 2001, max: 2050, label: '2001-2050' },
        { min: 2051, max: 2100, label: '2051-2100' },
        { min: 2101, max: 2150, label: '2101-2150' },
        { min: 2151, max: 2200, label: '2151-2200' },
        { min: 2201, max: 3000, label: '2201-3000' },
      ];

      // Gather all users from different sources
      const allUsers = [...users.value, ...queue.value, ...matches.value.flatMap(match => [match.user1, match.user2])];

      // Count users in each range
      const usersPerRange = ratingRanges.map(range => {
        const count = allUsers.filter(user => user.rating >= range.min && user.rating <= range.max).length;
        return count;
      });

      const labels = ratingRanges.map(range => range.label);
      const data = {
        labels: labels,
        datasets: [{
          label: 'Number of Users',
          data: usersPerRange,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          fill: false,
          tension: 0.1,
        }],
      };

      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      // eslint-disable-next-line
      const config: any = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'User Distribution by Rating Ranges' },
          },
          scales: {
            x: {
              display: true,
              title: { display: true, text: 'Rating Ranges' },
              ticks: {
                display: false
              }
            },
            y: {
              display: true,
              title: { display: true, text: 'Number of Users' },
              beginAtZero: true
            }
          }
        }
      };

      chartInstance.value = new Chart(chartCanvas.value, config);
    }


    return {
      goToState,
      PAGE_STATE,
      createAddUser,
      createAddMultipleUsers,
      users,
      queue,
      matches,
      millisToMinutesAndSeconds,
      statistics,
      resetSimulation,
      sortUsersByRating,
      speedFactor,
      mmSettings,
      chartCanvas,
      amountOfMultipleUsers,
    }
  }
});
</script>

<style scoped>
#matchmakingSimulation {
  background-color: black;
}

.page-container {
  max-width: 80% !important;
  width: auto !important;
  min-width: auto !important;
  margin: 0 auto !important;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

h1 {
  font-size: 30px;
  margin-bottom: 10px;
  margin-top: 10px;
}

h1 span {
  font-size: 80%;
  opacity: 0.7;
}

h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.statistics,
.settings {
  padding: 10px;
  border: 1px solid #ccc;
  width: 100%;
}

.statistics p,
.settings p {
  margin: unset;
  margin-bottom: 5px;
  font-size: 120%;
}

.statistics p span,
.settings p span {
  font-size: 80%;
  opacity: 0.7;
}

.multi-stat {
  display: flex;
  width: 100%;
}

.multi-stat>* {
  width: calc(100% / 3);
}

.column {
  border: 1px solid #ccc;
  padding: 10px;
  width: calc(100% / 3);
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.column.col-2 {
  width: 50%;
  height: auto !important;
}

.scrollable {
  overflow: scroll;
  max-height: 100%;
  width: 100%;
}

.scrollable p {
  margin: unset;
}

.row {
  display: flex;
}

.match {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.match>span {
  padding: 10px;
}

*>.match:last-of-type {
  margin-bottom: 0;
}

.match>.user {
  width: 50%;
  margin: unset
}

.match>.user.won {
  background-color: rgb(0, 255, 0, 0.2);
}

.match>.user.lost {
  background-color: rgb(255, 0, 0, 0.2);
}

.user {
  background-color: rgb(20, 20, 20);
  padding: 5px 10px;
  margin-bottom: 10px;
  font-size: 120%;
}

.user .username {
  margin-bottom: 10px;
  text-transform: uppercase;
  text-decoration: underline;
}

.user .rating {
  margin-bottom: 5px;
}

.user .rating span {
  font-size: 80%;
  opacity: 0.7;
}

.user .queueAmount span {
  font-size: 80%;
  opacity: 0.7;
}

.user .startRDev span {
  font-size: 80%;
  opacity: 0.7;
}

.user .time span {
  font-size: 80%;
  opacity: 0.7;
}

.user p {
  margin: unset;
}

*>.user:last-of-type {
  margin-bottom: 0;
}

button+button {
  margin-left: 10px;
}

.button-wrapper {
  margin-bottom: 15px;
}

.settings .settings-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.settings .settings-wrapper p {
  width: 50%;
}
</style>
