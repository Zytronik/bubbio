<template>
  <transition name="slide-in">
    <div class="overlay channel-overlay" v-if="isVisible" @click.self="slideOverlayOut">
      <button class="openChannelButton">Channel</button>
      <div class="channel-container">
        <div class="channel-content">
          <div class="channel-centerContent">
            <div class="channel-topbar">
              <h2>Welcome to blubb.io</h2>
              <div class="tabs">
                <button v-for="tab in tabs" :key="tab" :class="{ active: currentTab === tab }"
                  @click="currentTab = tab">
                  {{ tab }}
                </button>
              </div>
            </div>
            <div class="channel-main">
              <transition name="fade">
                <div v-if="currentTab === 'Dashboard'" class="tab-content dashoboard-tab">
                  <div class="stats">
                    <div class="stat">
                      <span ref="peopleOnlineRef">{{ stats.peopleOnline }}</span>
                      <p>People Online</p>
                    </div>
                    <div class="stat">
                      <span ref="activeLobbiesRef">{{ stats.activeLobbies }}</span>
                      <p>Active Lobbies</p>
                    </div>
                    <div class="stat">
                      <span ref="registeredUsersRef">{{ stats.registeredUsers }}</span>
                      <p>Registered Users</p>
                    </div>
                    <div class="stat">
                      <span ref="gamesPlayedRef">{{ stats.gamesPlayed }}</span>
                      <p>Games Played</p>
                    </div>
                  </div>
                  <div class="dashboard-bottom">
                    <div class="channel-global-chat">
                      <h3>Global Chat</h3>
                      <div class="messages" ref="messagesContainer">
                        <div v-for="(msg, i) in messages" :key="i">{{ msg.timestamp }} {{ msg.username }}: {{ msg.text
                          }}
                        </div>
                      </div>
                      <div v-if="isAuthenticated" class="chat-inputs">
                        <input v-model="chatInput" placeholder="Type a message..." @keyup.enter="sendChatMessage" />
                        <button @click="sendChatMessage">Send</button>
                      </div>
                    </div>
                    <div class="news">
                      <h3>News</h3>
                      <div class="news-wrapper">
                        <transition-group name="fade">
                          <div v-for="(item,i) in newsData" :key="i" class="news-item">
                            <div>
                              <img :src="item.userImg ? item.userImg : getDefaultProfilePbURL()"
                                alt="User's profile picture">
                              <p>
                                <span class="username" @click="openUserProfile(item.username)">{{ item.username.toUpperCase() }}</span> achieved <span>#{{ item.rank }}</span> in <span>{{
                                  item.type }} ({{ formatFieldValue(item.mods, "mods") }})</span> with <span>{{ formatTimeNumberToString(item.value) }}</span>
                              </p>
                            </div>
                            <p class="time">{{ formatDateToAgoText(item.createdAt) }}</p>
                          </div>
                          <div v-if="newsData.length === 0" key="no-news" class="no-news-message">
                            <p>No news to display.</p>
                          </div>
                        </transition-group>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
              <transition name="fade">
                <div v-if="currentTab === 'Leaderboards'" class="tab-content">
                  <LeaderboardsTab />
                </div>
              </transition>
              <transition name="fade">
                <div v-if="currentTab === 'Spectate'" class="tab-content">
                  <SpectateTab />
                </div>
              </transition>
            </div>
          </div>
          <div class="channel-sidebar">
            <div class="player-search">
              <h3>Find Players</h3>
              <input type="text" placeholder="Search user..." v-model="searchQuery" />
              <ul :class="{ 'expanded': searchResults.length > 0 }">
                <li v-for="user in searchResults" :key="user.id" @click="openUserProfile(user.username)">
                  <img v-if="user.countryCode" :src="getFlagImagePath(user.countryCode)"
                    :alt="`${user.country}`"><span>{{
                    user.username.toUpperCase() }}</span>
                </li>
              </ul>
            </div>
            <div class="friend-listing">
              <h3 v-if="isAuthenticated">Friend Listing (TODO)</h3>
              <div class="friendList" v-for="friend in friendsList" :key="friend.id">
                <div class="friend">
                  <p>{{ friend.username }}</p>
                  <div>
                    <span>Invite</span>
                    <span>Spectate</span>
                    <span>Message</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <transition name="fade-scale">
            <UserProfileOverlay v-if="showUserProfileOverlay && selectedUsername" :username="selectedUsername"
              @close-overlay="closeUserProfileOverlay" />
          </transition>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Ref, computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import debounce from 'debounce';
import { closeChannelOverlay } from '@/ts/page/page.page-manager';
import { httpClient } from '@/ts/networking/networking.http-client';
import axios from 'axios';
import UserProfileOverlay from '../UserProfileOverlay.vue';
import SpectateTab from './components/SpectateTab.vue';
import LeaderboardsTab from './components/LeaderboardsTab.vue';
import state from '@/ts/networking/networking.client-websocket';
import { checkUserAuthentication } from '@/ts/networking/networking.auth';
import useChatStore from '@/ts/page/page.globalChat';
import { CountUp } from 'countup.js';
import { getDefaultProfilePbURL } from '@/ts/networking/paths';
import { formatTimeNumberToString } from '@/ts/game/visuals/game.visuals.stat-display';
import { backInput } from '@/ts/input/input.all-inputs';
import { getFlagImagePath, getFriends } from '@/ts/page/page.page-requests';
import { formatDateToAgoText } from '@/ts/page/page.page-utils';
import { formatFieldValue } from '@/ts/page/i/page.i.stat-display';
import eventBus from '@/ts/page/page.event-bus';

export default {
  name: "ChannelOverlay",
  components: { UserProfileOverlay, SpectateTab, LeaderboardsTab },
  data() {
    return {
      currentTab: 'Dashboard',
      tabs: ['Dashboard', 'Leaderboards', 'Spectate'],
    };
  },
  setup() {
    /* Search Users */
    interface User {
      id: number;
      username: string;
      countryCode: string,
      country: string,
    }

    const searchQuery = ref('');
    const searchResults = ref<User[]>([]);

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

    /* Overlay & URL */
    const selectedUsername = ref<string | null>(null);
    const showUserProfileOverlay = ref<boolean>(false);
    const isVisible = ref(false);

    function openUserProfile(username: string) {
      let delay = 0;
      if (showUserProfileOverlay.value == true) {
        closeUserProfileOverlay();
        delay = 200;
      }
      setTimeout(() => {
        searchQuery.value = "";
        selectedUsername.value = username.toLocaleLowerCase();
        showUserProfileOverlay.value = true;
        history.pushState(null, '', `/user/${selectedUsername.value}`);
      }, delay);
    }

    function slideOverlayIn() {
      isVisible.value = true;
    }

    function slideOverlayOut() {
      isVisible.value = false;
      setTimeout(() => {
        closeChannelOverlay();
        closeUserProfileOverlay();
      }, 400);
    }

    function closeUserProfileOverlay() {
      searchQuery.value = "";
      showUserProfileOverlay.value = false;
      selectedUsername.value = null;
      history.replaceState(null, '', '/');
      updateFriendList();
    }

    function showUserPageFromURL() {
      const path = window.location.pathname;
      const match = path.match(/^\/user\/(.+)$/);
      if (match) {
        const username = match[1].toLowerCase();
        openUserProfile(username);
      }
    }

    /* Messages */
    const messagesContainer: Ref<HTMLElement | null> = ref(null);
    const { messages } = useChatStore();
    const chatInput = ref('');

    function sendChatMessage() {
      if (state.socket && chatInput.value.trim() !== '') {
        state.socket.emit('sendGlobalChatMessage', { text: chatInput.value });
        chatInput.value = '';
      }
    }

    function scollGlobalChatToBottom() {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    }

    watch(messages, () => {
      nextTick(() => {
        scollGlobalChatToBottom();
      });
    }, { deep: true });

    /* Stats */
    interface GlobalStats {
      peopleOnline: number;
      activeLobbies: number;
      registeredUsers: number;
      gamesPlayed?: number;
    }

    const stats = ref({
      peopleOnline: 0,
      activeLobbies: 0,
      registeredUsers: 0,
      gamesPlayed: 0,
    });
    const peopleOnlineRef = ref(null);
    const activeLobbiesRef = ref(null);
    const registeredUsersRef = ref(null);
    const gamesPlayedRef = ref(null);
    let intervalId = 0;
    const initialAnimationDone = ref(false);

    function handleGlobalStatsUpdate(globalStats: GlobalStats) {
      stats.value = {
        peopleOnline: globalStats.peopleOnline,
        activeLobbies: globalStats.activeLobbies,
        registeredUsers: globalStats.registeredUsers,
        gamesPlayed: globalStats.gamesPlayed ?? stats.value.gamesPlayed,
      };
      if (!initialAnimationDone.value) {
        animateStat(peopleOnlineRef.value, stats.value.peopleOnline);
        animateStat(activeLobbiesRef.value, stats.value.activeLobbies);
        animateStat(registeredUsersRef.value, stats.value.registeredUsers);
        animateStat(gamesPlayedRef.value, stats.value.gamesPlayed);
        initialAnimationDone.value = true;
      }
    }

    function animateStat(element: HTMLElement | null, endVal: number) {
      if (element) {
        const countUp = new CountUp(element, endVal);
        if (!countUp.error) {
          countUp.start();
        }
      }
    }

    async function fetchStats() {
      try {
        const response = await httpClient.get('/sprint/totalGames');
        stats.value.gamesPlayed = response.data;
        if (state.socket) {
          state.socket.emit('fetchGlobalStats');
        }
      } catch (error) {
        console.error('Failed to fetch total games played:', error);
      }
    }

    /* News */
    interface NewsData {
      type: string;
      mods: string;
      rank: number;
      value: number;
      createdAt: Date;
      username: string;
      userImg: string;
    }

    const newsData = ref<NewsData[]>([]);

    function fetchNews() {
      if (state.socket) {
        state.socket.emit('fetchNews');
      }
    }

    /* Friends */
    const friendsList = ref<User[] | null>(null);

    async function updateFriendList() {
      friendsList.value = [];//await getFriends();
    }

    eventBus.on('updateFriendList', updateFriendList);

    /* General */
    backInput.fire = slideOverlayOut;
    const isAuthenticated = computed(() => checkUserAuthentication());

    onMounted(async () => {
      if (state.socket) {
        state.socket.on('fetchGlobalStats', (globalStats: GlobalStats) => {
          handleGlobalStatsUpdate(globalStats);
        });
        state.socket.on('updateNews', (data: NewsData[]) => {
          newsData.value = data.map(item => ({
            ...item,
            createdAt: new Date(item.createdAt)
          }));
        });
      }


      fetchNews();
      slideOverlayIn();
      showUserPageFromURL();
      await fetchStats();
      await updateFriendList();
      intervalId = setInterval(async () => {
        await fetchStats();
      }, 30000);
      scollGlobalChatToBottom();
    });

    onUnmounted(() => {
      initialAnimationDone.value = false;
      if (state.socket) {
        state.socket.off('fetchGlobalStats', handleGlobalStatsUpdate);
      }
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
      peopleOnlineRef,
      activeLobbiesRef,
      registeredUsersRef,
      gamesPlayedRef,
      isVisible,
      slideOverlayOut,
      getFlagImagePath,
      newsData,
      formatDateToAgoText,
      getDefaultProfilePbURL,
      formatTimeNumberToString,
      formatFieldValue,
      getFriends,
      friendsList,
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
  overflow: hidden;
  max-height: 0;
  transition: all 0.3s ease;
}

.player-search ul.expanded {
  max-height: 500px;
}

.player-search li {
  cursor: pointer;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: black;
  transition: 200ms;
}

.player-search li img {
  max-width: 30px;
  height: 20px;
  margin-right: 10px;
  object-fit: contain;
}

.player-search li:hover {
  background-color: rgb(34, 34, 34);
}

.channel-global-chat .messages {
  flex-grow: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  margin-bottom: 5px;
}

.channel-global-chat .messages>div {
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
  z-index: 2;
  box-sizing: border-box;
}

.channel-centerContent {
  width: 80%;
  padding: 0 30px;
  box-sizing: border-box;
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
  z-index: 1;
  position: relative;
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
  box-sizing: border-box;
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

.news-item p span {
  font-weight: bold;
}

.news-item .username {
  cursor: pointer;
}

.news-item .time {
  white-space: nowrap;
}

.news-item img {
  width: 30px;
  height: 30px;
  object-fit: cover;
}

.news-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.news-item > div {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  max-width: 90%;
}

.news-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 15px;
  height: 100%;
  overflow-y: scroll;
}

.news-wrapper>div:not(.no-news-message) {
  background-color: rgb(30, 30, 30);
  padding: 10px 15px;
}

.openChannelButton {
  bottom: 85vh;
  cursor: auto;
}

@keyframes fadeScaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeScaleOut {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  animation-duration: 0.2s;
  animation-fill-mode: both;
  transition-timing-function: cubic-bezier(0.1, 0.7, 1.0, 0.1);
  transform-origin: 30% 50%;
}

.fade-scale-enter-active {
  animation-name: fadeScaleIn;
}

.fade-scale-leave-active {
  animation-name: fadeScaleOut;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(100%);
  }
}

.slide-in-enter-active,
.slide-in-leave-active {
  animation-duration: 0.2s;
  animation-fill-mode: both;
  transition-timing-function: cubic-bezier(0.1, 0.7, 1.0, 0.1);
}

.slide-in-enter-active {
  animation-name: slideIn;
}

.slide-in-leave-active {
  animation-name: slideOut;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  animation-duration: 0.2s;
  animation-fill-mode: both;
  transition-timing-function: cubic-bezier(0.1, 0.7, 1.0, 0.1);
}

.fade-enter-active {
  animation-name: fadeIn;
}

.fade-leave-active {
  animation-name: fadeOut;
}
</style>