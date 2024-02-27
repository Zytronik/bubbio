<template>
  <article id="app">
    <div class="topbar">
      <div v-if="isAuthenticated" @click="showMyProfile" class="profile-wrapper">
        <img class="profile-pic" :src="userData?.pbUrl" alt="Profile Picture">
        <div class="profile-content">
          <h3>{{ userData?.username.toUpperCase() }}</h3>
          <div>
            <p>Lv.420</p>
            <p class="rank">PI-Rank</p>
          </div>
        </div>
      </div>
    </div>
    <InfoMessages ref="infoMessageRef" />
    <LoginOverlay v-if="showLogin" @login="handleLogin" @checkUsername="handleCheckUsername" @register="handleRegister"
      @switchToUsernameForm="clearErrorMessage" :error-message="errorMessage" @playAsGuest="handlePlayAsGuest" />
    <Channel v-if="isChannelOpen" />
    <transition name="slide" mode="out-in">
      <component :is="currentComponent" :room-id="roomId" @joinedRoom="handleJoinRoom" @leftRoom="handleLeaveRoom"
        @showInfoMessage="showInfoMessage" @updateProfileData="updateProfileData" :key="currentComponentKey">
      </component>
    </transition>
    <div class="bottomBar">
      <button @click="openChannelOverlay" class="openChannelButton">Channel</button>
    </div>
  </article>
</template>

<script lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted, watch } from 'vue';
import state, { addSocketConnectListener, disconnectGlobalSocket, initializeGlobalSocket, reconnectGlobalSocket } from './ts/networking/networking.client-websocket';
import { currentPageState, goToState, isChannelActive, openChannelOverlay, pages, setupTransitionFunctions } from './ts/page/page.page-manager';
import LoginOverlay from './globalComponents/LoginOverlay.vue';
import InfoMessages from './globalComponents/InfoMessages.vue';
import Channel from './globalComponents/Channel.vue';

import { PAGE_STATE } from './ts/page/page.e-page-state';
import { checkIfUsernameIsTaken, checkUserAuthentication, clearClientState, login, loginAsGuest, logUserOut, register, showLoginForm } from './ts/networking/networking.auth';
import eventBus from './ts/page/page.event-bus';
import { httpClient } from './ts/networking/networking.http-client';
import { getDefaultProfilePbURL } from './ts/networking/paths';

interface InfoMessageComponent {
  showMessage: (message: string, type: string) => void;
}

export default {
  name: 'App',
  components: { LoginOverlay, InfoMessages, Channel },
  setup() {
    /* Channel */
    const isChannelOpen = isChannelActive();

    function showUserPageFromURL() {
      const path = window.location.pathname;
      const match = path.match(/^\/user\/(.+)$/);
      if (match) {
        isChannelOpen.value = true;
      }
    }

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

    watch(() => eventBus.state.showLogin, () => {
      onShowLoginForm();
    });

    async function handleLogin(username: string, password: string) {
      const { success, error } = await login(username, password);
      if (success) {
        eventBus.setShowLogin(false);
        reconnectGlobalSocket();
        joinRoomFromHash();
        isAuthenticated.value = checkUserAuthentication();
      } else {
        errorMessage.value = error;
      }
    }

    async function handleCheckUsername(username: string,) {
      if (await checkIfUsernameIsTaken(username)) {
        eventBus.emit('navigateToLogin');
      } else {
        eventBus.emit('navigateToRegister');
      }
    }

    async function handleRegister(username: string, password: string, passwordAgain: string) {
      const { success, error } = await register(username, password, passwordAgain);
      if (success) {
        handleLogin(username, password);
      } else {
        errorMessage.value = error;
      }
    }

    async function handlePlayAsGuest(username: string) {
      loginAsGuest(username);
      reconnectGlobalSocket();
      eventBus.setShowLogin(false);
      joinRoomFromHash();
      isAuthenticated.value = checkUserAuthentication();
    }

    function clearErrorMessage() {
      errorMessage.value = '';
    }

    function clearGuestCookies() {
      sessionStorage.removeItem('isGuest');
      sessionStorage.removeItem('guestUsername');
    }

    function onShowLoginForm() {
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
    });

    function updateProfileData(){
      if (isAuthenticated.value) {
        let isGuest = sessionStorage.getItem('isGuest');
        if (isGuest) {
          userData.value = {
            username: "Guest-" + (sessionStorage.getItem('guestUsername') || 'Guest'),
            pbUrl: getDefaultProfilePbURL(),
          };
        } else {
          fetchUserData().then((data) => {
            if (data) {
              const updatedPbUrl = data.pbUrl ? data.pbUrl : getDefaultProfilePbURL();
              userData.value = {
                ...data,
                pbUrl: updatedPbUrl,
              };
            }
          });
        }
      }
    }

    function showMyProfile() {
      let isGuest = sessionStorage.getItem('isGuest');
      if (isAuthenticated.value && !isGuest && userData.value && userData.value.username) {
        openProfile(userData.value.username);
      }
    }

    function openProfile(username:string){
      history.pushState(null, '', `/user/${username}`);
      showUserPageFromURL();
    }

    async function fetchUserData() {
      console.log("fetchUserData");
      const token = localStorage.getItem('authToken');
      const response = await httpClient.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
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
      window.addEventListener('beforeunload', clearGuestCookies);
    });

    onUnmounted(() => {
      disconnectGlobalSocket();
      window.removeEventListener('beforeunload', clearGuestCookies);
      clearGuestCookies();
    });

    return {
      showLogin,
      errorMessage,
      currentComponent,
      roomId,
      handleJoinRoom,
      handleLeaveRoom,
      handleLogin,
      handleCheckUsername,
      handleRegister,
      clearErrorMessage,
      logUserOut,
      showInfoMessage,
      infoMessageRef,
      handlePlayAsGuest,
      isChannelOpen,
      openChannelOverlay,
      userData,
      isAuthenticated,
      updateProfileData,
      showMyProfile,
      currentComponentKey,
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
  background-color: rgb(53, 53, 53);
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

.slide-enter-active, .slide-leave-active {
  transition: transform 0.2s ease;
}

.slide-enter-from, .slide-leave-to {
  position: absolute;
  width: 100%;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-enter-to {
  transform: translateX(0);
}

.slide-leave-from {
  transform: translateX(0);
}

.slide-leave-to {
  transform: translateX(-100%);
}



</style>