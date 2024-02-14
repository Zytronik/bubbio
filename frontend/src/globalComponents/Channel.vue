<template>
  <UserProfileOverlay v-if="showUserProfileOverlay && selectedUsername" :username="selectedUsername"
    @close-overlay="closeUserProfileOverlay" />
  <div class="overlay channel-overlay">
    <div class="channel-container">
      <button @click="closeChannelOverlay">Close</button>
      <h2>Blubbiunity</h2>
      <h3>Global Chat</h3>
      <div class="global-chat">
        <div class="messages">
          <div v-for="(msg, i) in chatMessages" :key="i">{{ msg.username }}: {{ msg.text }}</div>
        </div>
        <input v-if="isAuthenticated" v-model="chatInput" placeholder="Type a message..." @keyup.enter="sendChatMessage" />
        <button v-if="isAuthenticated" @click="sendChatMessage">Send</button>
      </div>

      <h3 v-if="isAuthenticated">Direct Chat (NOT NOW)</h3>
      <h3 v-if="isAuthenticated">Friend Listing (NOT NOW)</h3>
      <h3>Basic Stats</h3>
      <p>People Online: {{ stats.peopleOnline }}</p>
      <p>Active Lobbies: {{ stats.activeLobbies }}</p>
      <p>Registered Users: {{ stats.registeredUsers }}</p>
      <h3>Search User</h3>
      <input type="text" placeholder="Search user..." v-model="searchQuery" />
      <ul v-if="searchResults.length">
        <li v-for="user in searchResults" :key="user.id" @click="openUserProfile(user.username)">
          {{ user.username }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import debounce from 'debounce';
import { closeChannelOverlay } from '@/ts/page/page.page-manager';
import { httpClient } from '@/ts/networking/networking.http-client';
import axios from 'axios';
import UserProfileOverlay from './UserProfileOverlay.vue';
import state from '@/ts/networking/networking.client-websocket';
import { checkUserAuthentication } from '@/ts/networking/networking.auth';

interface User {
  id: number;
  username: string;
}

interface GlobalChatMessage {
  username: string;
  text: string;
}

export default {
  name: "ChannelOverlay",
  components: { UserProfileOverlay },
  setup() {
    const searchQuery = ref('');
    const searchResults = ref<User[]>([]);
    const selectedUsername = ref<string | null>(null);
    const showUserProfileOverlay = ref<boolean>(false);
    const stats = ref({
      peopleOnline: 0,
      activeLobbies: 0,
      registeredUsers: 0,
    });
    let intervalId = 0;
    const chatMessages = ref<GlobalChatMessage[]>([]);
    const chatInput = ref('');
    const isAuthenticated = computed(() => checkUserAuthentication());

    const fetchSearchResults = debounce(async (query) => {
      if (query.trim() === '') {
        searchResults.value = [];
        return;
      }
      try {
        const response = await httpClient.get(`/users/search`, { params: { query } });
        searchResults.value = response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Failed to fetch search results:', error.message);
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    }, 300);

    watchEffect(() => {
      fetchSearchResults(searchQuery.value);
    });

    function openUserProfile(username: string) {
      searchQuery.value = "";
      selectedUsername.value = username;
      showUserProfileOverlay.value = true;
      history.pushState(null, '', `/user/${username}`);
    }

    function closeUserProfileOverlay() {
      searchQuery.value = "";
      showUserProfileOverlay.value = false;
      selectedUsername.value = null;
      history.replaceState(null, '', '/');
    }

    function showUserPageFromURL() {
      const path = window.location.pathname;
      const match = path.match(/^\/user\/(.+)$/);
      if (match) {
        const username = match[1];
        openUserProfile(username);
      }
    }

    function sendChatMessage() {
      if (state.socket && chatInput.value.trim() !== '') {
        state.socket.emit('sendGlobalChatMessage', { text: chatInput.value });
        chatInput.value = '';
      }
    }

    function loadChatHistory() {
      const storedMessages = sessionStorage.getItem('globalChatHistory');
      if (storedMessages) {
        chatMessages.value = JSON.parse(storedMessages);
      }
    }

    function saveChatHistory() {
      sessionStorage.setItem('globalChatHistory', JSON.stringify(chatMessages.value));
    }

    function fetchStats() {
      if (state.socket) {
        state.socket.emit('fetchGlobalStats');
      }
    }

    if (state.socket) {
      state.socket.on('fetchGlobalStats', (globalStats) => {
        stats.value = globalStats;
      });

      state.socket.on('sendGlobalChatMessage', (message: GlobalChatMessage) => {
        chatMessages.value.push(message);
      });
    }

    onMounted(() => {
      loadChatHistory();
      showUserPageFromURL();
      fetchStats();
      intervalId = setInterval(fetchStats, 10000);
    });

    watch(chatMessages, () => {
      saveChatHistory();
    }, { deep: true });

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });

    return {
      searchQuery,
      searchResults,
      closeChannelOverlay,
      openUserProfile,
      selectedUsername,
      showUserProfileOverlay,
      closeUserProfileOverlay,
      stats,
      chatMessages,
      chatInput,
      sendChatMessage,
      isAuthenticated,
    };
  },
}
</script>
  
<style scoped>
.channel-container {
  background: rgb(30, 30, 30);
  padding: 30px 20px;
  width: 100%;
}

.channel-overlay{
  z-index: 10;
}

ul {
  list-style-type: none;
}

li {
  cursor: pointer;
}

li:hover {
  opacity: 0.5;
}

.global-chat .messages {
  height: 200px;
  overflow-y: auto;
}
</style>