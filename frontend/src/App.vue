<template>
  <article id="app">
    <InfoMessages ref="infoMessageRef" />
    <LoginOverlay v-if="showLogin" @login="handleLogin" @checkUsername="handleCheckUsername" @register="handleRegister"
      @switchToUsernameForm="clearErrorMessage" :error-message="errorMessage" @playAsGuest="handlePlayAsGuest"/>
    <component :is="currentComponent" :room-id="roomId" @joinedRoom="handleJoinRoom" @leftRoom="handleLeaveRoom"
      @showInfoMessage="showInfoMessage">
    </component>
  </article>
</template>

<script lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue';
import state, { addSocketConnectListener, disconnectGlobalSocket, initializeGlobalSocket } from './ts/networking/networking.client-websocket';
import { currentPageState, goToState, pages, setupTransitionFunctions } from './ts/page/page.page-manager';
import LoginOverlay from './globalComponents/LoginOverlay.vue';
import InfoMessages from './globalComponents/InfoMessages.vue';
import { PAGE_STATE } from './ts/page/page.e-page-state';
import { checkIfUsernameIsTaken, checkUserAuthentication, clearClientState, login, loginAsGuest, logUserOut, register, showLoginForm } from './ts/networking/networking.auth';
import eventBus from './ts/page/page.event-bus';

interface InfoMessageComponent {
  showMessage: (message: string, type: string) => void;
}

export default {
  name: 'App',
  components: { LoginOverlay, InfoMessages },
  setup() {
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
        initializeGlobalSocket();
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
      eventBus.setShowLogin(false);
      initializeGlobalSocket();
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
      console.log("test3");
      console.log(state.socket);
      if (state.socket) {
        console.log("test2");
        state.socket.on('isUserInRoomAlready', (isUserInRoomAlready: boolean, rId: string) => {
          console.log("test1");
          if (!isUserInRoomAlready) {
            roomId.value = rId;
            goToState(PAGE_STATE.roomPage);
          } else {
            showInfoMessage('You are already in this room.', 'info');
            //emit('showInfoMessage', 'You are already in this room.', 'info'); 
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

    /* General */
    onMounted(() => {
      setupTransitionFunctions();
      if (checkUserAuthentication()) {
        initializeGlobalSocket();
        joinRoomFromHash();
      } else {
        clearClientState();
        showLoginForm();
      }

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
    };
  },
}


</script>