<template>
  <section id="matchmakingSimulation" class="page">
    <div class="page-wrapper">
      <div class="page-container">
        <button @click="goToState(PAGE_STATE.multiMenu)" class="back-button">Back</button>
        <button @click="resetSimulation" class="back-button">Reset</button>
        <h1>Matchmaking Simulation</h1>

        <div class="row">
          <div class="settings">
            <h2>Settings</h2>
            <div class="settings-wrapper">
              <p><span>Startwert für den akzeptablen Skill Gap:</span> 100</p>
              <p><span>Zeit in Millisekunden, nach der der Skill Gap erhöht wird:</span> 1000</p>
              <p><span>Zeit in Millisekunden, nach der Matchmaking Funktion ausgeführt wird:</span> 1000</p>
              <p><span>Wert für erhöhung des Skill Gaps:</span> 100</p>
              <p><span>Maximale Erweiterung des Skill Gaps:</span> 1000</p>
            </div>
          </div>
        </div>

        <div class="row">

          <div class="column">
            <h2>Not in Queue</h2>
            <div class="button-wrapper">
              <button @click="createUser">Create User</button>
              <button @click="create100Users">Create & Add 100 Users</button>
              <button @click="addAllUsersToQueue">Add All To Queue</button>
            </div>
            <div class="scrollable">
              <div v-for="(user, index) in users" :key="'not-in-queue-' + index" class="user">
                <p class="username">{{ user.name }}</p>
                <p class="rating"><span>Rating: </span>{{ user.rating }}<span>±{{ user.ratingDeviation }}</span></p>
              </div>
            </div>
          </div>

          <div class=" column">
            <h2>In Queue</h2>
            <div class="scrollable">
              <div v-for="(user, index) in queue" :key="'in-queue-' + index" class="user">
                <p class="username">{{ user.name }}</p>
                <p class="rating"><span>Rating: </span>{{ user.rating }}<span>±{{ user.ratingDeviation }}</span></p>
              </div>
              <p v-if="queue.length === 0">No users in queue</p>
            </div>
          </div>

          <div class="column">
            <h2>Matched</h2>
            <div class="scrollable">
              <div v-for="(match, index) in matches" :key="'matched-' + index" class="match">
                <div class="user">
                  <p class="username">{{ match.user1.name }}</p>
                  <p class="rating"><span>Rating: </span>{{ match.user1.rating }}<span>±{{ match.user1.ratingDeviation
                      }}</span></p>
                  <p class="time"><span>Waiting Time: </span>{{ millisToMinutesAndSeconds(match.user1.waitingTime ?? 0) }}
                  </p>
                </div>
                <span>VS</span>
                <div class="user">
                  <p class="username">{{ match.user2.name }}</p>
                  <p class="rating"><span>Rating: </span>{{ match.user2.rating }}<span>±{{ match.user2.ratingDeviation
                      }}</span></p>
                  <p class="time"><span>Waiting Time: </span>{{ millisToMinutesAndSeconds(match.user2.waitingTime ?? 0) }}
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
            <p><span>Found Matches: </span>{{ matches.length }}</p>
            <div class="multi-stat">
              <p><span>Average Waiting Time: </span>{{ statistics?.averageWaitingTime ?? 0 }}</p>
              <p><span>Highest Waiting Time: </span>{{ statistics?.highestWaitingTime ?? 0 }}</p>
              <p><span>Lowest Waiting Time: </span>{{ statistics?.lowestWaitingTime ?? 0 }}</p>
            </div>
            <div class="multi-stat">
              <p><span>Average Rating Difference: </span>{{ statistics?.averageRatingDifference ?? 0 }}</p>
              <p><span>Highest Rating Difference: </span>{{ statistics?.highestRatingDifference ?? 0 }}</p>
              <p><span>Lowest Rating Difference: </span>{{ statistics?.lowestRatingDifference ?? 0 }}</p>
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
  waitingTime?: number;
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
      createRandomUser();
    }

    function create100Users() {
      const minDelay = 0;
      const maxDelay = 3000;

      for (let i = 0; i < 100; i++) {
        const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        setTimeout(() => {
          createRandomUser();
          setTimeout(() => {
            addAllUsersToQueue();
          }, 1000);
        }, randomDelay * i);
      }
    }

    function createRandomUser() {
      const index = currentId.value;
      currentId.value++;
      const name = `tester-${index}`;
      const minRating = 500;
      const maxRating = 5000;
      const minRatingDeviation = 60;
      const maxRatingDeviation = 300;

      const rating = Math.floor(Math.random() * (maxRating - minRating + 1)) + minRating;
      const ratingDeviation = Math.floor(Math.random() * (maxRatingDeviation - minRatingDeviation + 1)) + minRatingDeviation;

      const newUser: User = { name, rating, ratingDeviation };
      users.value.push(newUser);
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
        }
      });
    }

    function getUserByName(name: string) {
      return users.value.find(user => user.name === name);
    }

    function resetSimulation() {
      users.value = [];
      queue.value = [];
      matches.value = [];
      currentId.value = 1;
      if(state.socket){
        state.socket.emit('resetMatchmakingSimulation');
      }
    }

    function millisToMinutesAndSeconds(millis: number) {
      let minutes: number = Math.floor(millis / 60000);
      let seconds: number = parseInt(((millis % 60000) / 1000).toFixed(0));
      return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    const statistics = computed(() => {
      let highestWaitingTime = 0;
      let lowestWaitingTime = Infinity;
      let highestRatingDifference = 0;
      let lowestRatingDifference = Infinity;

      if (matches.value.length === 0) return null;

      const totalWaitingTime = matches.value.reduce((acc, match) => {
        const user1WaitingTime = match.user1.waitingTime ?? 0;
        const user2WaitingTime = match.user2.waitingTime ?? 0;
        const waitingTimeSum = user1WaitingTime + user2WaitingTime;

        highestWaitingTime = Math.max(highestWaitingTime, waitingTimeSum);
        lowestWaitingTime = Math.min(lowestWaitingTime, waitingTimeSum);

        if (user1WaitingTime && user2WaitingTime) {
          return acc + user1WaitingTime + user2WaitingTime;
        } else {
          return acc;
        }
      }, 0);

      const totalRatingDifference = matches.value.reduce((acc, match) => {
        const ratingDifference = Math.abs(match.user1.rating - match.user2.rating);

        highestRatingDifference = Math.max(highestRatingDifference, ratingDifference);
        lowestRatingDifference = Math.min(lowestRatingDifference, ratingDifference);

        return acc + ratingDifference;
      }, 0);

      const numberOfValidMatches = matches.value.reduce((acc, match) => {
        if (match.user1.waitingTime && match.user2.waitingTime) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0);

      const averageWaitingTime = millisToMinutesAndSeconds(totalWaitingTime / (numberOfValidMatches * 2));
      const averageRatingDifference = Math.round(totalRatingDifference / matches.value.length);

      return {
        averageWaitingTime,
        highestWaitingTime: millisToMinutesAndSeconds(highestWaitingTime),
        lowestWaitingTime: millisToMinutesAndSeconds(lowestWaitingTime),
        averageRatingDifference,
        highestRatingDifference,
        lowestRatingDifference,
      };
    });

    return {
      goToState,
      PAGE_STATE,
      createUser,
      create100Users,
      users,
      addAllUsersToQueue,
      queue,
      matches,
      millisToMinutesAndSeconds,
      statistics,
      resetSimulation,
    }
  }
});
</script>

<style scoped>
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
  align-items: start;
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
