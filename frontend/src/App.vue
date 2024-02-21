<template>
  <article id="app">
    <div class="topbar">
      <div class="profile-wrapper">
        <div class="profile-content">
          <p>{{ userData?.username.toUpperCase() }}</p>
        </div>
        <img class="profile-pic" :src="profilePicImagePath" alt="Profile Picture">
      </div>
    </div>
    <button @click="openChannelOverlay" style="position:  absolute; left: 50%; transform: translateX(-50%); z-index: 5; position: relative;">Channel</button>
    <InfoMessages ref="infoMessageRef" />
    <LoginOverlay v-if="showLogin" @login="handleLogin" @checkUsername="handleCheckUsername" @register="handleRegister"
      @switchToUsernameForm="clearErrorMessage" :error-message="errorMessage" @playAsGuest="handlePlayAsGuest"/>
    <Channel v-if="isChannelOpen"/>
    <component :is="currentComponent" :room-id="roomId" @joinedRoom="handleJoinRoom" @leftRoom="handleLeaveRoom"
      @showInfoMessage="showInfoMessage">
    </component>
  </article>
</template>

<script lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue';
import state, { addSocketConnectListener, disconnectGlobalSocket, initializeGlobalSocket, reconnectGlobalSocket } from './ts/networking/networking.client-websocket';
import { currentPageState, goToState, isChannelActive, openChannelOverlay, pages, setupTransitionFunctions } from './ts/page/page.page-manager';
import LoginOverlay from './globalComponents/LoginOverlay.vue';
import InfoMessages from './globalComponents/InfoMessages.vue';
import Channel from './globalComponents/Channel.vue';

import { PAGE_STATE } from './ts/page/page.e-page-state';
import { checkIfUsernameIsTaken, checkUserAuthentication, clearClientState, login, loginAsGuest, logUserOut, register, showLoginForm } from './ts/networking/networking.auth';
import eventBus from './ts/page/page.event-bus';
import { httpClient } from './ts/networking/networking.http-client';
import { getProfilePbURL } from './ts/networking/paths';

interface InfoMessageComponent {
  showMessage: (message: string, type: string) => void;
}

export default {
  name: 'App',
  components: { LoginOverlay, InfoMessages, Channel },
  setup() {
    /* Channel */
    const isChannelOpen = isChannelActive();

    function showUserPageFromURL(){
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

    async function handleLogin(username: string, password: string) {
      const { success, error } = await login(username, password);
      if (success) {
        eventBus.setShowLogin(false);
        reconnectGlobalSocket();
        joinRoomFromHash();
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
    }

    function clearErrorMessage() {
      errorMessage.value = '';
    }

    function clearGuestCookies(){
      sessionStorage.removeItem('isGuest');
      sessionStorage.removeItem('guestUsername');
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

    /* Profile */
    interface UserData {
      username: string;
      countryCode: string;
      country: string;
      pbUrl: string;
    }

    const userData = ref<UserData | null>(null);
    const username = ref<string>("");

    const profilePicImagePath = computed(() => {
      if (userData.value && userData.value.pbUrl) {
        return userData.value ? getProfilePbURL() + userData.value.pbUrl : '';
      }
      return getProfilePbURL() + 'default/pbPlaceholder.png';
    });

    async function fetchUserData() {
      const token = localStorage.getItem('authToken');
      const response = await httpClient.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }

    /* General */
    onMounted(async() => {
      setupTransitionFunctions();
      initializeGlobalSocket();
      if (checkUserAuthentication()) {
        userData.value = await fetchUserData();
        joinRoomFromHash();
      } else {
        clearClientState();
        showLoginForm();
      }

      showUserPageFromURL();
      addSocketConnectListener(initOnIsUserInRoomAlready);
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
      profilePicImagePath,
    };
  },
}


</script>
<style scoped>
.topbar{
  width: 100vw;
  height: 10vh;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.profile-wrapper{
  height: 100%;
  width: 15vw;
  background-color: rgb(53, 53, 53);
  display: flex;
  flex-direction: row;
}

.profile-content{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 15px;
}

.profile-content p{
  margin: unset;
  font-size: 20px;
}

.profile-wrapper img {
  height: 100%;
  width: 10vh;
  object-fit: cover;
}
</style>