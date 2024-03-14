<template>
  <div class="leaderboard-wrapper">
    <h3>Leaderboard</h3>
    <div v-if="loading" class="loader"></div>
    <p>
      <span>Game Mode: {{ gameMode }} | </span>
      <span v-if="!isLoggedIn && !country">Category: global | </span>
      <span v-else>Category: {{ leaderboardCategory }} | </span>
      <span v-if="country">Country: {{ country }} | </span>
      <span v-else-if="isLoggedIn">Country: auto | </span>
      <span>Sorted By: {{ orderedFields[0] }} </span>
    </p>
    <table v-if="leaderboard.length">
      <thead>
        <tr>
          <th></th>
          <th>Username</th>
          <th v-for="field in orderedFields" :key="field">
            <span>{{ getFullName(field) }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in leaderboard" :key="index" :class="{ 'me': entry.userId === userData?.id }">
          <td>
            <p>{{ index + 1 }}</p>
          </td>
          <td>
            <div class="user-info">
              <img :src="entry.user.pbUrl ? entry.user.pbUrl : getDefaultProfilePbURL()" alt="flag" width="30" height="30" />
              <p>{{ entry.user.username }}</p>
            </div>
          </td>
          <td v-for="field in orderedFields" :key="field">
            <p>{{ formatFieldValue(entry[field], field) }}</p>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No entries found.</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';
import { httpClient } from '@/ts/networking/networking.http-client';
import { GameMode, LeaderboardCategory, SortDirection } from '@/ts/page/page.e-leaderboard';
import { checkUserAuthentication } from '@/ts/networking/networking.auth';
import eventBus from '@/ts/page/page.event-bus';
import { UserData } from '@/ts/page/page.i-userData';
import { GameStats } from '@/ts/game/i/game.i.game-stats';
import { getDefaultProfilePbURL } from '@/ts/networking/paths';
import { formatFieldValue, getFullName } from '@/ts/page/page.i.stat-display';

interface LeaderboardEntry extends GameStats {
  user: {
    username: string;
    country: string;
    pbUrl: string;
    id: number;
  };
  userId: number;
  submittedAt: string;
  // eslint-disable-next-line
  [key: string]: any;
}

export default defineComponent({
  name: 'LeaderboardComponent',
  props: {
    gameMode: {
      type: String as PropType<GameMode>,
      required: true,
      validator: (value: string): boolean => Object.values(GameMode).includes(value as GameMode),
    },
    fields: {
      type: Array as PropType<string[]>,
      required: true,
    },
    sortBy: {
      type: String,
      required: true,
    },
    sortDirection: {
      type: String,
      required: false,
      validator: (value: string): boolean => Object.values(SortDirection).includes(value as SortDirection),
      default: SortDirection.Desc,
    },
    leaderboardCategory: {
      type: String,
      required: true,
      validator: (value: string): boolean => Object.values(LeaderboardCategory).includes(value as LeaderboardCategory),
    },
    country: {
      type: String,
      required: false,
    },
    limit: {
      type: Number,
      default: 20,
    },
  },
  setup(props) {
    const leaderboard = ref<LeaderboardEntry[]>([]);
    const loading = ref(true);
    const userData: UserData | null = eventBus.getUserData();
    const isLoggedIn = computed(() => checkUserAuthentication() && !sessionStorage.getItem('isGuest'));
    const orderedFields = computed(() => {
      const fieldsWithoutSortBy = props.fields.filter(field => field !== props.sortBy);
      return [props.sortBy, ...fieldsWithoutSortBy];
    });

    async function fetchLeaderboardData() {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const response = await httpClient.get("/leaderboard/data", {
          params: {
            gameMode: props.gameMode,
            sortBy: props.sortBy,
            sortDirection: props.sortDirection,
            category: props.leaderboardCategory,
            country: props.country,
            limit: props.limit,
          },
          headers: headers
        });

        leaderboard.value = response.data;
        loading.value = false;
      } catch (error) {
        console.error("Failed to fetch leaderboard data: ", error);
        loading.value = false;
      }
    }

    onMounted(async () => {
      await fetchLeaderboardData();
    });

    return {
      leaderboard,
      orderedFields,
      loading,
      getDefaultProfilePbURL,
      isLoggedIn,
      userData,
      formatFieldValue,
      getFullName,
    };
  },
});
</script>

<style scoped>
table {
  margin: 15px 0;
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

tr.me {
  background-color: rgba(30, 30, 30, 0.3);
}

td img {
  vertical-align: middle;
}

td p {
  vertical-align: middle;
  margin: unset;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.loader {
  width: 30px;
  aspect-ratio: 2;
  --_g: no-repeat radial-gradient(circle closest-side, #ffffff 90%, #ffffff00);
  background:
    var(--_g) 0% 50%,
    var(--_g) 50% 50%,
    var(--_g) 100% 50%;
  background-size: calc(100%/3) 50%;
  animation: l3 1s infinite linear;
}

@keyframes l3 {
  20% {
    background-position: 0% 0%, 50% 50%, 100% 50%
  }

  40% {
    background-position: 0% 100%, 50% 0%, 100% 50%
  }

  60% {
    background-position: 0% 50%, 50% 100%, 100% 0%
  }

  80% {
    background-position: 0% 50%, 50% 50%, 100% 100%
  }
}
</style>
