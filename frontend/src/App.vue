<template>
  <article id="app">
    <div class="topbar">
      <div v-if="isAuthenticated && userData" @click="showMyProfile" class="profile-wrapper">
        <img class="profile-pic" :src="userData?.pbUrl" alt="Profile Picture">
        <div class="profile-content">
          <h3>{{ userData?.username.toUpperCase() }}</h3>
          <div>
            <p>Lv.727</p>
            <p class="rank">PI-Rank</p>
          </div>
        </div>
      </div>
    </div>
    <InfoMessages ref="infoMessageRef" />
    <LoginOverlay v-if="showLogin" @joinRoomFromHash="joinRoomFromHash" @updateAuthenticatedState="updateAuthenticatedState" />
    <Channel v-if="isChannelOpen" />
    <transition :name="isNavigatingForward ? 'slide-left' : 'slide-right'" mode="out-in">
      <component :is="currentComponent" :room-id="roomId" @joinedRoom="handleJoinRoom" @leftRoom="handleLeaveRoom" @updateProfileData="updateProfileData" :key="currentComponentKey">
      </component>
    </transition>
    <div class="bottomBar">
      <button @click="openChannelOverlay" class="openChannelButton">Channel</button>
    </div>
  </article>
</template>

<script lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted, watch } from 'vue';
import state, { addSocketConnectListener, disconnectGlobalSocket, initializeGlobalSocket } from './ts/networking/networking.client-websocket';
import { currentPageState, goToState, isChannelActive, openChannelOverlay, openProfile, pages, setupTransitionFunctions, showUserPageFromURL } from './ts/page/page.page-manager';
import LoginOverlay from './globalComponents/LoginOverlay.vue';
import InfoMessages from './globalComponents/InfoMessages.vue';
import Channel from './globalComponents/Channel.vue';

import { PAGE_STATE } from './ts/page/page.e-page-state';
import { checkUserAuthentication, clearClientState, clearGuestCookies, logUserOut, showLoginForm } from './ts/networking/networking.auth';
import eventBus from './ts/page/page.event-bus';
import { attachInputReader } from './ts/input/input.input-reader';
import { httpClient } from './ts/networking/networking.http-client';
import { getDefaultProfilePbURL } from './ts/networking/paths';
import { applySavedInputSettings, enableBackInputs, enableChannelInput, enableNetworkDebugInputs } from './ts/input/input.input-manager';
import { setupSocketListeners } from "./ts/game/network/game.network.commands";

interface InfoMessageComponent {
  showMessage: (message: string, type: string) => void;
}

interface InfoMessageData {
  message: string;
  type: 'info' | 'error' | 'success';
}

export default {
  name: 'App',
  components: { LoginOverlay, InfoMessages, Channel },
  setup() {
    attachInputReader();
    /* Channel */
    const isChannelOpen = isChannelActive();

    /* Message Component */
    const infoMessageRef = ref<InfoMessageComponent | null>(null);

    function showInfoMessage(message: string, type: string) {
      if (infoMessageRef.value) {
        infoMessageRef.value.showMessage(message, type);
      } else {
        console.error('InfoMessage component is not available');
      }
    }

    /* Login Component */
    const showLogin = computed(() => eventBus.state.showLogin);
    const errorMessage = ref<string>('');
    const isAuthenticated = ref<boolean>(false);

    function updateAuthenticatedState() {
      isAuthenticated.value = checkUserAuthentication();
    }

    /* Room Component */
    const roomId = ref<string>('');

    function handleJoinRoom(rId: string) {
      if (state.socket) {
        state.socket.emit('isUserInRoomAlready', { rId });
      }
    }

    function handleLeaveRoom() {
      roomId.value = '';
      goToState(PAGE_STATE.roomListing);
    }

    function getRoomIdFromHash() {
      return window.location.hash.substring(1);
    }

    function joinRoomFromHash() {
      const roomId = getRoomIdFromHash();
      if (roomId) {
        handleJoinRoom(roomId);
      }
    }

    function initOnIsUserInRoomAlready() {
      if (state.socket) {
        state.socket.on('isUserInRoomAlready', (isUserInRoomAlready: boolean, rId: string) => {
          if (!isUserInRoomAlready) {
            roomId.value = rId;
            goToState(PAGE_STATE.roomPage);
          } else {
            showInfoMessage('You are already in this room.', 'info');
          }
        });
      }
    }

    /* Page Components */
    const currentPageIndex = computed(() => pages.findIndex(p => p.pageState === currentPageState.value));
    const currentComponent = computed(() => {
      const index = currentPageIndex.value;
      return pages[index].component;
    });

    const isNavigatingForward = ref(true);

    const updateDirection = (direction: boolean) => {
      isNavigatingForward.value = direction;
    };

    watchEffect(() => {
      document.title = `${document.title.split('|')[0]} | ${pages[currentPageIndex.value].title}`;
    });

    watch(() => currentPageState.value, () => {
      onPageChange();
    });

    function onPageChange() {
      isAuthenticated.value = checkUserAuthentication();
    }

    const currentComponentKey = computed(() => {
      return currentPageIndex.value;
    });

    /* Profile */
    interface UserData {
      username: string;
      countryCode?: string;
      country?: string;
      pbUrl: string;
    }

    const userData = ref<UserData | null>(null);

    watch(() => isAuthenticated.value, () => {
      updateProfileData();
      applySavedInputSettings();
    });

    async function updateProfileData() {
      if (isAuthenticated.value) {
        let isGuest = sessionStorage.getItem('isGuest');
        if (isGuest) {
          userData.value = {
            username: "Guest-" + (sessionStorage.getItem('guestUsername') || 'Guest'),
            pbUrl: getDefaultProfilePbURL(),
          };
        } else {
          const data = await fetchUserData()
          if (data) {
            const updatedPbUrl = data.pbUrl ? data.pbUrl : getDefaultProfilePbURL();
            userData.value = {
              ...data,
              pbUrl: updatedPbUrl,
            };
          }
        }
        eventBus.setUserData(userData.value);
      }
    }

    function showMyProfile() {
      let isGuest = sessionStorage.getItem('isGuest');
      if (isAuthenticated.value && !isGuest && userData.value && userData.value.username) {
        openProfile(userData.value.username);
      }
    }

    async function fetchUserData() {
      const token = localStorage.getItem('authToken');
      try {
        const response = await httpClient.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        logUserOut();
      }
      return;
    }

    /* General */
    function initOnSocketDisconnect(){
      if(state.socket){
        state.socket.on('disconnect', () => {
          //showInfoMessage('Disconnected from server. Reconnecting...', 'info');
        });
      }
    }

    onMounted(async () => {
      addSocketConnectListener(setupSocketListeners);
      enableBackInputs();
      enableChannelInput();
      enableNetworkDebugInputs();
      setupTransitionFunctions();
      initializeGlobalSocket();
      isAuthenticated.value = checkUserAuthentication();
      if (isAuthenticated.value) {
        joinRoomFromHash();
      } else {
        clearClientState();
        showLoginForm();
      }
      showUserPageFromURL();
      addSocketConnectListener(initOnIsUserInRoomAlready);
      addSocketConnectListener(initOnSocketDisconnect);
      eventBus.on('navigationDirectionChanged', updateDirection);
      eventBus.on('show-info-message', (infoMessageData: InfoMessageData) => {
        showInfoMessage(infoMessageData.message, infoMessageData.type);
      });
      window.addEventListener('beforeunload', clearGuestCookies);
    });

    onUnmounted(() => {
      disconnectGlobalSocket();
      window.removeEventListener('beforeunload', clearGuestCookies);
      eventBus.off('show-info-message');
      eventBus.off('navigationDirectionChanged');
      clearGuestCookies();
    });

    return {
      showLogin,
      errorMessage,
      currentComponent,
      roomId,
      handleJoinRoom,
      handleLeaveRoom,
      logUserOut,
      infoMessageRef,
      isChannelOpen,
      openChannelOverlay,
      userData,
      isAuthenticated,
      updateProfileData,
      showMyProfile,
      currentComponentKey,
      isNavigatingForward,
      joinRoomFromHash,
      updateAuthenticatedState,
    };
  },
}


</script>
<style scoped>
.topbar {
  width: 100vw;
  height: 5vh;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: rgb(30, 30, 30);
  z-index: 1;
  position: relative;
}

.profile-wrapper {
  height: 100%;
  width: 20vw;
  background-color: rgb(30, 30, 30);
  display: flex;
  flex-direction: row;
  cursor: pointer;
  height: 10vh;
  position: relative;
}

.profile-wrapper::before{
  position: absolute;
  content: '';
  width: 0px;
  height: 1px;
  border-style: solid;
  border-width: 5vh 10vh 5vh 0;
  border-color: transparent rgb(30, 30, 30) transparent transparent;
  display: inline-block;
  vertical-align: middle;
  right: 100%;
  top: 0;
}

.profile-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 30px 0 15px;
}

.profile-content > div {
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  font-size: 20px;
}

.profile-content > div .rank {
  margin-left: 30px;
}

.profile-content h3 {
  margin: unset;
  font-size: 20px;
}

.profile-content p {
  margin: unset;
}

.profile-wrapper img {
  height: 100%;
  width: 10vh;
  object-fit: cover;
}

.openChannelButton {
  bottom: 0;
  z-index: 5;
}

.openChannelButton:hover {
  background-color: rgb(55, 55, 55);
}

.bottomBar {
  width: 100vw;
  height: 5vh;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: rgb(30, 30, 30);
}

/* Existing slide-left transitions */
.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 0.15s ease;
}
.slide-left-enter-from, .slide-left-leave-to {
  position: absolute;
  width: 100vw;
}
.slide-left-enter-from {
  transform: translateX(100vw);
}
.slide-left-enter-to, .slide-left-leave-from {
  transform: translateX(0);
}
.slide-left-leave-to {
  transform: translateX(-100vw);
}

/* New slide-right transitions */
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.15s ease;
}
.slide-right-enter-from, .slide-right-leave-to {
  position: absolute;
  width: 100vw;
}
.slide-right-enter-from {
  transform: translateX(-100vw);
}
.slide-right-enter-to, .slide-right-leave-from {
  transform: translateX(0);
}
.slide-right-leave-to {
  transform: translateX(93vw);
}




</style>./ts/game/network/game.network.commands