<template>
  <UserProfileOverlay v-if="showUserProfileOverlay && selectedUsername" :username="selectedUsername"
    @close-overlay="closeUserProfileOverlay" />
  <div class="overlay channel-overlay">
    <div class="channel-container">
      <button class="goBackButton" @click="closeChannelOverlay">X</button>
      <div class="channel-content">
        <div class="channel-centerContent">
          <div class="channel-topbar">
            <h2>Welcome to the Blubbiunity</h2>
            <div class="tabs">
              <button v-for="tab in tabs" :key="tab" :class="{ active: currentTab === tab }" @click="currentTab = tab">
                {{ tab }}
              </button>
            </div>
          </div>
          <div class="channel-main">
            <div v-if="currentTab === 'Dashboard'" class="tab-content dashoboard-tab">
              <div class="stats">
                <div class="stat">
                  <span>{{ stats.peopleOnline }}</span>
                  <p>People Online</p>
                </div>
                <div class="stat">
                  <span>{{ stats.activeLobbies }}</span>
                  <p>Active Lobbies</p>
                </div>
                <div class="stat">
                  <span>{{ stats.registeredUsers }}</span>
                  <p>Registered Users</p>
                </div>
                <div class="stat">
                  <span>{{ stats.gamesPlayed }}</span>
                  <p>Games Played</p>
                </div>
              </div>
              <div class="dashboard-bottom">
                <div class="channel-global-chat">
                  <h3>Global Chat</h3>
                  <div class="messages" ref="messagesContainer">
                    <div v-for="(msg, i) in messages" :key="i">{{ msg.timestamp }} {{ msg.username }}: {{ msg.text }}</div>
                  </div>
                  <div v-if="isAuthenticated" class="chat-inputs">
                    <input v-model="chatInput" placeholder="Type a message..."
                      @keyup.enter="sendChatMessage" />
                    <button @click="sendChatMessage">Send</button>
                  </div>
                </div>
                <div class="news">
                  <h3>News (TODO)</h3>
                  <div class="news-wrapper">
                    <div>blablabla</div>
                    <div>blablabla</div>
                    <div>blablabla</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="currentTab === 'Leaderboards'" class="tab-content">
              <p>TODO</p>
            </div>
            <div v-if="currentTab === 'Spectate'" class="tab-content">
              <p>TODO</p>
            </div>
          </div>
        </div>
        <div class="channel-sidebar">
          <div class="player-search">
            <h3>Find Players</h3>
            <input type="text" placeholder="Search user..." v-model="searchQuery" />
            <ul :class="{ 'expanded': searchResults.length > 0 }">
              <li v-for="user in searchResults" :key="user.id" @click="openUserProfile(user.username)">
                {{ user.username.toUpperCase() }}
              </li>
            </ul>
          </div>
          <div class="friend-listing">
            <h3 v-if="isAuthenticated">Friend Listing (TODO)</h3>
            <div class="friend">
              <p>Friend 1</p>
              <div>
                <span>Invite</span>
                <span>Spectate</span>
                <span>Message</span>
              </div>
            </div>
            <div class="friend">
              <p>Friend 2</p>
              <div>
                <span>Invite</span>
                <span>Spectate</span>
                <span>Message</span>
              </div>
            </div>
            <div class="friend">
              <p>Friend 3</p>
              <div>
                <span>Invite</span>
                <span>Spectate</span>
                <span>Message</span>
              </div>
            </div>
            <div class="friend">
              <p>Friend 4</p>
              <div>
                <span>Invite</span>
                <span>Spectate</span>
                <span>Message</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import debounce from 'debounce';
import { closeChannelOverlay } from '@/ts/page/page.page-manager';
import { httpClient } from '@/ts/networking/networking.http-client';
import axios from 'axios';
import UserProfileOverlay from './UserProfileOverlay.vue';
import state from '@/ts/networking/networking.client-websocket';
import { checkUserAuthentication } from '@/ts/networking/networking.auth';
import useChatStore from '@/ts/page/page.globalChat';

interface User {
  id: number;
  username: string;
}

export default {
  name: "ChannelOverlay",
  components: { UserProfileOverlay },
  data() {
    return {
      currentTab: 'Dashboard',
      tabs: ['Dashboard', 'Leaderboards', 'Spectate'],
    };
  },
  setup() {
    const searchQuery = ref('');
    const searchResults = ref<User[]>([]);
    const selectedUsername = ref<string | null>(null);
    const showUserProfileOverlay = ref<boolean>(false);
    const stats = ref({
      peopleOnline: 0,
      activeLobbies: 0,
      registeredUsers: 0,
      gamesPlayed: 0,
    });
    const messagesContainer: Ref<HTMLElement | null> = ref(null);
    let intervalId = 0;
    const { messages } = useChatStore();
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

    async function fetchStats() {
      if (state.socket) {
        state.socket.emit('fetchGlobalStats');
      }
      try {
        const response = await httpClient.get('/sprint/totalGames');
        stats.value.gamesPlayed = response.data;
      } catch (error) {
        console.error('Failed to fetch total games played:', error);
      }
    }

    if (state.socket) {
      state.socket.on('fetchGlobalStats', (globalStats) => {
        stats.value = globalStats;
      });
    }

    watch(messages, () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    }, { deep: true });

    onMounted(() => {
      showUserPageFromURL();
      fetchStats();
      intervalId = setInterval(fetchStats, 30000);


    });

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
      chatInput,
      sendChatMessage,
      isAuthenticated,
      messages,
      messagesContainer,
    };
  },
}
</script>
  
<style scoped>
.channel-container {
  background: rgb(30, 30, 30);
  width: 100%;
  height: 90vh;
  overflow: hidden;
}

.channel-overlay {
  z-index: 10;
}

.player-search ul {
  list-style-type: none;
  padding: 15px 0;
  margin: unset;
  max-height: 0;
  transition: max-height 0.4s ease-out;
}

.player-search ul.expanded {
  max-height: 100%;
}

.player-search li {
  cursor: pointer;
  margin-bottom: 5px;
}

.player-search li:hover {
  opacity: 0.5;
}

.channel-global-chat .messages {
  flex-grow: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  margin-bottom: 5px;
}

.channel-global-chat .messages > div  {
  padding: 2px 0;
}

.channel-content {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.channel-global-chat {
  background-color: black;
  box-sizing: border-box;
  height: 100%;
}

.channel-global-chat input {
  width: 80%;
  border: none;
  outline: none;
  background-color: white;
  margin: unset;
  flex-grow: 1;
  box-sizing: border-box;
}

.channel-global-chat button {
  width: 20%;
  flex-grow: 1;
  border: none;
  outline: none;
  margin: unset;
  background-color: gray;
}

.channel-global-chat .chat-inputs {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  height: 30px;
  margin-top: auto;
}

.channel-sidebar {
  width: 20%;
  height: 100%;
  background-color: rgb(53, 53, 53);
  padding: 15px;
}

.channel-centerContent {
  width: 80%;
  padding: 0 30px;
}

.player-search {
  min-height: 10%;
}

.player-search input {
  color: white;
  width: 100%;
  background-color: transparent;
  border: unset;
  outline: none;
  border-bottom: 1px solid white;
  padding: 0 0 10px 0;
}

h3 {
  margin: unset;
  margin-bottom: 10px;
  font-size: 20px;
}

h2 {
  margin: unset;
  margin-bottom: 15px;
}

.friend-listing {
  max-height: 90%;
  height: 90%;
}

.friend-listing .friend {
  background-color: black;
  padding: 10px 10px;
  margin-bottom: 20px;
}

.friend-listing .friend span {
  margin-right: 15px;
}

.friend-listing .friend p {
  margin: unset;
}

.friend-listing .friend>div {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.tabs button {
  padding: 10px;
  border: none;
  background-color: rgb(53, 53, 53);
  cursor: pointer;
  margin-left: 15px;
  opacity: 0.4;
  color: white;
  font-size: 20px;
}

.tabs button.active {
  background-color: rgb(53, 53, 53);
  opacity: 1;
}

.tab-content {
  background-color: rgb(53, 53, 53);
  height: 100%;
  padding: 0 15px;
}

.channel-topbar {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 15px;
  box-sizing: border-box;
  height: 8%;
}

.tab-content p {
  margin: unset;
}

.channel-main {
  height: 92%;
}

.stats {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 55%;
}

.stat {
  width: 17vw;
  height: 17vw;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.stat span {
  font-size: 6vw;
  margin-bottom: 15px;
}

.dashboard-bottom {
  display: flex;
  flex-direction: row;
  gap: 30px;
  height: 45%;
}

.dashboard-bottom>div {
  width: 50%;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.dashoboard-tab {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news {
  background-color: black;
}

.news-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 15px;
  height: 100%;
}

.news-wrapper>div {
  background-color: rgb(53, 53, 53);
  padding: 5px 15px;
}
</style>