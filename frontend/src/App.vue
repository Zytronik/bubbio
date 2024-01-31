<template>
  <article id="app">
    <button v-if="!showLogin" @click="logUserOut">Log Out</button>
    <InfoMessages ref="infoMessageRef" />
    <LoginOverlay v-if="showLogin" @login="handleLogin" @checkUsername="handleCheckUsername" @register="handleRegister"
      @switchToUsernameForm="clearErrorMessage" :error-message="errorMessage" />
    <component :is="currentComponent" :room-id="roomId" @joinedRoom="handleJoinRoom" @leftRoom="handleLeaveRoom"
      @showInfoMessage="showInfoMessage">
    </component>
  </article>
</template>

<script lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue';
import { disconnectGlobalSocket, initializeGlobalSocket } from './ts/networking/networking.client-websocket';
import { currentPageState, goToState, pages, setupTransitionFunctions } from './ts/page/page.page-manager';
import LoginOverlay from './globalComponents/LoginOverlay.vue';
import InfoMessages from './globalComponents/InfoMessages.vue';
import { eventBus } from './ts/page/page.event-bus';
import { PageState } from './ts/page/page.e-page-state';
import { checkIfUsernameIsTaken, checkUserAuthentication, clearClientState, login, logUserOut, register, showLoginForm } from './ts/networking/networking.auth';

interface InfoMessageComponent {
  showMessage: (message: string, type: string) => void;
}

export default {
  name: 'App',
  components: { LoginOverlay, InfoMessages },
  setup() {
    const infoMessageRef = ref<InfoMessageComponent | null>(null);
    const showLogin = ref<boolean>(false);
    const errorMessage = ref<string>('');
    const roomId = ref<string>('');
    const currentPageIndex = computed(() => pages.findIndex(p => p.pageState === currentPageState.value));
    const currentComponent = computed(() => {
      const index = currentPageIndex.value;
      return pages[index].component;
    });

    watchEffect(() => {
      document.title = `${document.title.split('|')[0]} | ${pages[currentPageIndex.value].title}`;
    });

    const setShowLogin = (show: boolean) => {
      showLogin.value = show;
    };

    eventBus.setShowLogin = setShowLogin;

    function handleJoinRoom(rId: string) {
      roomId.value = rId;
      goToState(PageState.roomPage);
    }

    function handleLeaveRoom() {
      roomId.value = '';
      goToState(PageState.roomListing);
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

    function showInfoMessage(message: string, type: string) {
  if (infoMessageRef.value) {
    infoMessageRef.value.showMessage(message, type);
  } else {
    console.error('InfoMessage component is not available');
  }
}


    onMounted(() => {
      setupTransitionFunctions();
      if (checkUserAuthentication()) {
        initializeGlobalSocket();
        joinRoomFromHash();
      } else {
        clearClientState();
        showLoginForm();
      }
    });

    onUnmounted(() => {
      eventBus.setShowLogin = null;
      disconnectGlobalSocket();
    });

    async function handleLogin(username: string, password: string) {
      const { success, error } = await login(username, password);
      if (success) {
        showLogin.value = false;
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

    function clearErrorMessage() {
      errorMessage.value = '';
    }

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
    };
  },
}


</script>