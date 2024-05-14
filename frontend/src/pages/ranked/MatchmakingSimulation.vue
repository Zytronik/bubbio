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
              <p><span>Startwert für den akzeptablen Skill Gap:</span> 100</p>
              <p><span>Zeit in Millisekunden, nach der der Skill Gap erhöht wird:</span> 8000</p>
              <p><span>Zeit in Millisekunden, nach der Matchmaking Funktion ausgeführt wird:</span> 5000</p>
              <p><span>Wert für erhöhung des Skill Gaps:</span> 100</p>
              <p><span>Minimale Erhöhung des Skill Gaps:</span> 10</p>
              <p><span>Maximale Erweiterung des Skill Gaps:</span> 800</p>
            </div>
          </div>
        </div>

        <div class="row">

          <div class="column">
            <h2>Not in Queue</h2>
            <div class="button-wrapper">
              <button @click="createAddUser">Create & Add 1 User</button>
              <button @click="createAdd50Users">Create & Add 50 Users</button>
              <!-- <button @click="createAddRandomUser">Create & Add 1 R. User</button>
              <button @click="createAdd100RandomUsers">Create & Add 100 R. Users</button> -->
              <!-- <button @click="addAllUsersToQueue">Add All To Queue</button> -->
            </div>
            <div class="scrollable">
              <div v-for="(user, index) in users" :key="'not-in-queue-' + index" class="user">
                <p class="username">{{ user.name }}</p>
                <p class="rating"><span>Rating: </span>{{ user.rating }}<span>±{{ user.ratingDeviation }}</span></p>
                <p class="queueAmount"><span>Queued: </span> {{ user.amountOfQueues }}/{{ user.maxAmountOfQueues }}</p>
                <p class="startRDev"><span>Start RD: </span> {{ user.startDeviation }}</p>
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
                  <p class="time" v-if="match.user1.waitingTime"><span>Waiting Time: </span>{{ millisToMinutesAndSeconds(match.user1.waitingTime  * speedFactor) ?? 0
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
                  <p class="time" v-if="match.user2.waitingTime"><span>Waiting Time: </span>{{ millisToMinutesAndSeconds(match.user2.waitingTime  * speedFactor) ?? 0
                    }}
                  </p>
                </div>
              </div>
              <p v-if="matches.length === 0">No matches found</p>
            </div>
          </div>

        </div>

        <div class="row">
          <div class="statistics">
            <h2>Statistics</h2>
            <p><span>Found Matches: </span>{{ statistics.matchCount }}</p>
            <div class="multi-stat">
              <p><span>Average Waiting Time: </span>{{ millisToMinutesAndSeconds(statistics.averageWaitingTime * speedFactor) ?? 0 }}</p>
              <p><span>Highest Waiting Time: </span>{{ millisToMinutesAndSeconds(statistics.highestWaitingTime * speedFactor) ?? 0 }}</p>
              <p><span>Lowest Waiting Time: </span>{{ millisToMinutesAndSeconds(statistics.lowestWaitingTime * speedFactor) ?? 0 }}</p>
            </div>
            <div class="multi-stat">
              <p><span>Average Rating Difference: </span>{{ statistics.averageRatingDifference ?? 0 }}</p>
              <p><span>Highest Rating Difference: </span>{{ statistics.highestRatingDifference ?? 0 }}</p>
              <p><span>Lowest Rating Difference: </span>{{ isFinite(statistics.lowestRatingDifference) ? statistics.lowestRatingDifference : "∞" }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>



<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { addGameViewStyles, removeGameViewStyles } from '@/ts/page/page.css-transitions';
import state from '@/ts/networking/networking.client-websocket';

interface User {
  name: string;
  rating: number;
  ratingDeviation: number;
  volatility: number;
  waitingTime?: number;
  hasWon?: boolean;
  hasLost?: boolean;
  amountOfQueues: number;
  maxAmountOfQueues: number;
  startDeviation: number;
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

    onMounted(() => {
      changeBackgroundTo("black");
      addGameViewStyles();
      mountSockets();
    });

    onUnmounted(() => {
      removeGameViewStyles();
      unmountSockets();
    });

    function unmountSockets() {
      if (state.socket) {
        state.socket.emit('playerLeftMmSimVue');
      }
    }

    function mountSockets() {
      if (state.socket) {
        state.socket.emit('playerJoinedMmSimVue');
      }
    }

    function createUser() {
      const name = `tester-${currentId.value}`;
      currentId.value++;
      const rating = 1500;
      /* const ratingDeviation = 250; */
      const volatility = 0.06;
      const amountOfQueues = 0;
      const minMaxAmountOfQueues = 10;
      const maxMaxAmountOfQueues = 20;
      const maxAmountOfQueues = Math.floor(Math.random() * (maxMaxAmountOfQueues - minMaxAmountOfQueues + 1)) + minMaxAmountOfQueues;

      const minRatingDeviation = 60;
      const maxRatingDeviation = 250;
      const ratingDeviation = formatRating(Math.random() * (maxRatingDeviation - minRatingDeviation + 1)) + minRatingDeviation;

      const newUser: User = { name, rating, ratingDeviation, volatility, amountOfQueues, maxAmountOfQueues, startDeviation: ratingDeviation };
      users.value.push(newUser);
      return newUser;
    }

    function createAdd100RandomUsers() {
      for (let i = 0; i < 6; i++) {
        const user = createRandomUser();
          addUserToQueue(user);
      }
    }

    function createAdd50Users() {
      for (let i = 0; i < 50; i++) {
        const user = createUser();
          addUserToQueue(user);
      }
    }

    function createAddUser() {
      const user = createUser();
      addUserToQueue(user);
    }

    function createAddRandomUser() {
      const user = createRandomUser();
      addUserToQueue(user);
    }

    function addUserToQueue(user: User) {
      if (user.amountOfQueues >= user.maxAmountOfQueues) return;
      user.amountOfQueues++;

      const minDelay = 5000 / speedFactor.value;
      const maxDelay = 60000  / speedFactor.value;
      const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      setTimeout(() => {
        if (state.socket) {
          state.socket.emit('addUserToQueue', user);
        }
      }, randomDelay);
    }

    function createRandomUser() {
      const index = currentId.value;
      currentId.value++;
      const name = `tester-${index}`;
      const minRating = 500;
      const maxRating = 5000;
      const minRatingDeviation = 60;
      const maxRatingDeviation = 300;
      const minVolatility = 0.04;
      const maxVolatility = 0.06;
      const minMaxAmountOfQueues = 10;
      const maxMaxAmountOfQueues = 20;

      const rating = formatRating(Math.random() * (maxRating - minRating + 1)) + minRating;
      const ratingDeviation = formatRating(Math.random() * (maxRatingDeviation - minRatingDeviation + 1)) + minRatingDeviation;
      const volatility = formatVolatity((Math.random() * (maxVolatility - minVolatility) + minVolatility))

      const amountOfQueues = 0;
      const maxAmountOfQueues = Math.floor(Math.random() * (maxMaxAmountOfQueues - minMaxAmountOfQueues + 1)) + minMaxAmountOfQueues;

      const newUser: User = { name, rating, ratingDeviation, volatility, amountOfQueues, maxAmountOfQueues, startDeviation: ratingDeviation};
      users.value.push(newUser);
      return newUser;
    }

    function formatRating(rating: number) {
      return Math.round(rating);
    }

    function formatVolatity(volatility: number) {
      return Math.round(volatility * 1000) / 1000;
    }

    function addAllUsersToQueue() {
      if (state.socket) {
        state.socket.emit('addAllUsersToQueue', users.value);
      }
    }

    if (state.socket) {
      state.socket.on('queueUpdate', (q: MatchmakingQueue) => {
        for (const username in q) {
          let user = getUserByName(username)
          if (user) {
            user.waitingTime = q[username].searchStart;
            users.value = users.value.filter((u) => u.name !== username);
            queue.value.push(user);
          }
        }
      });

      state.socket.on('matchFoundUpdate', (match: string[]) => {
        let user1 = queue.value.find(user => user.name === match[0]);
        let user2 = queue.value.find(user => user.name === match[1]);
        if (user1 && user2 && user1.waitingTime && user2.waitingTime) {
          user1.waitingTime = Date.now() - user1.waitingTime;
          user2.waitingTime = Date.now() - user2.waitingTime;
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

      state.socket.on('ratingsUpdate', (ratingUpdate: User[]) => {
        let winner = ratingUpdate[0];
        let loser = ratingUpdate[1];
        const maxDelay = 600000  / speedFactor.value;
        const minDelay = 120000  / speedFactor.value;
        const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

        // Wait for x seconds
        setTimeout(() => {
          // Add both users to users array if they are not already in there
          [winner, loser].forEach(user => {
            if (!users.value.some(u => u.name === user.name)) {
              users.value.push({
                ...user,
                waitingTime: undefined,  // Reset or assign appropriate waiting time
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

        }, randomDelay);
      });
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
      console.log(users.value);
      if (state.socket) {
        state.socket.emit('resetMatchmakingSimulation');
      }
    }

    function millisToMinutesAndSeconds(millis: number) {
      if(millis === Infinity) return "∞";
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
      if(!user1.waitingTime || !user2.waitingTime) return;
      const waitingTime = user1.waitingTime + user2.waitingTime;
      const ratingDifference = Math.abs(user1.rating - user2.rating);
      statistics.value.totalWaitingTime += waitingTime;
      statistics.value.totalRatingDifference += ratingDifference;
      statistics.value.matchCount++;
      statistics.value.averageWaitingTime = statistics.value.totalWaitingTime / statistics.value.matchCount;
      statistics.value.averageRatingDifference = Math.round(statistics.value.totalRatingDifference / statistics.value.matchCount);
      statistics.value.highestWaitingTime = Math.max(statistics.value.highestWaitingTime, waitingTime);
      statistics.value.lowestWaitingTime = Math.min(statistics.value.lowestWaitingTime, waitingTime);
      statistics.value.highestRatingDifference = Math.max(statistics.value.highestRatingDifference, ratingDifference);
      statistics.value.lowestRatingDifference = Math.min(statistics.value.lowestRatingDifference, ratingDifference);
    }

    return {
      goToState,
      PAGE_STATE,
      createAddUser,
      createAddRandomUser,
      createAdd50Users,
      createAdd100RandomUsers,
      users,
      addAllUsersToQueue,
      queue,
      matches,
      millisToMinutesAndSeconds,
      statistics,
      resetSimulation,
      sortUsersByRating,
      speedFactor,
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
}

.multi-stat>* {
  width: 20%;
}

.column {
  border: 1px solid #ccc;
  padding: 10px;
  width: calc(100% / 3);
  height: 55vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
