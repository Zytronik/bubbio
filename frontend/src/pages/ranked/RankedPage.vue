<template>
  <section id="multiMenu" class="page menu">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="page-container">
        <div v-if="playerStats">
          <p>Current Elo: <span>{{ playerStats.rating }}</span></p>
          <p>Rating Deviation: <span>+/-{{ playerStats.ratingDeviation }}</span></p>
          <p>Global Rank: <span>#{{ playerStats.globalRank }}</span></p>
          <p>Games Won: <span>{{ playerStats.gamesWon }}/{{ playerStats.gamesCount }}</span></p>
          <p>Rank: <span>{{ playerStats.rank }}</span></p>
        </div>
        <br><br>
        <p>Player in Queue: <span>{{ playersInQueue }}</span></p>
        <p>Players in Ranked Games: <span>0</span></p>
        <p>Estimated waiting Time: <span>{{ countdownText }}</span></p>
        <button @click="toggleQueue" :class="{ 'in-queue': isInQueue }">
          {{ isInQueue ? 'Leave Queue' : 'Enter Queue' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { onMounted, onUnmounted, ref } from 'vue';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import state from '@/ts/networking/networking.client-websocket';
import { httpClient } from '@/ts/networking/networking.http-client';

interface PlayerMatchmakingStats {
  rating: number;
  ratingDeviation: number;
  globalRank: number;
  gamesWon: number;
  gamesCount: number;
  rank: string;
}

export default {
  name: 'RankedPage',
  components: { MenuBackButtons },
  setup() {
    const backButtonData = ref([
      { pageState: PAGE_STATE.multiMenu, iconSrc: require('@/img/icons/ranked.png'), disabled: false },
      { pageState: PAGE_STATE.roomListing, iconSrc: require('@/img/icons/rooms.png'), disabled: true },
    ]);
    const isInQueue = ref<boolean>(false);
    const playerStats = ref<PlayerMatchmakingStats | null>(null);
    const playersInQueue = ref<number>(0);
    const estimatedWaitTime = ref<number>(0);
    const countdownText = ref<string>('');
    let estTimeInterval: ReturnType<typeof setInterval> | undefined = 0;

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
        state.socket.emit('leaveQueue');
        state.socket.emit('getQueueSize');
      }
    }

    function enterQueue() {
      if (state.socket) {
        state.socket.emit('enterQueue');
      }
    }

    function startestTimeCountdown() {
      if (estTimeInterval) {
        clearInterval(estTimeInterval); // Vorherigen Countdown stoppen, falls vorhanden
      }
      estTimeInterval = setInterval(() => {
        if (estimatedWaitTime.value > 0) {
          estimatedWaitTime.value -= 1;
          countdownText.value = `${estimatedWaitTime.value}s`;
        } else {
          countdownText.value = "Unknown";
          clearInterval(estTimeInterval as ReturnType<typeof setInterval>);
        }
      }, 1000);
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

    function mountSockets() {
      if (state.socket) {
        state.socket.emit('getEstimatedWaitTime');

        state.socket.on('estimatedWaitTime', (estWaitTime: number) => {
          estimatedWaitTime.value = estWaitTime;
          startestTimeCountdown();
        });

        state.socket.on('matchFound', () => {
          isInQueue.value = false;
          alert('Match found!');
        });

        state.socket.on('queueSize', (size: number) => {
          playersInQueue.value = size;
        });
      }
    }

    function unmountSockets() {
      if (state.socket) {
        state.socket.off('estimatedWaitTime');
        state.socket.off('matchFound');
        state.socket.off('queueSize');
      }
    }

    onMounted(() => {
      changeBackgroundTo('linear-gradient(45deg, rgba(126,10,41,1) 0%, rgba(144,141,58,1) 100%)');
      fetchPlayerMmStats();
      mountSockets();
    });

    onUnmounted(() => {
      unmountSockets();
      clearInterval(estTimeInterval);
    });

    return {
      goToState,
      PAGE_STATE,
      backButtonData,
      changeBackgroundTo,
      toggleQueue,
      isInQueue,
      playerStats,
      countdownText,
      playersInQueue,
    }
  }
};
</script>

<style scoped>
.back-buttons::before {
  background: linear-gradient(45deg, rgba(43, 221, 185, 1) 0%, rgba(198, 63, 119, 1) 100%);
}

.in-queue {
  background-color: #f00;
  color: #fff;
}

p {
  margin: unset;
}
</style>