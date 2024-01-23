<template>
  <article id="app">
    <LoginOverlay v-if="showLogin" @login="handleLogin" :error-message="loginErrorMessage" />
    <component :is="currentComponent" :room-id="roomId" @joinedRoom="handleJoinRoom" @leftRoom="handleLeaveRoom">
    </component>
  </article>
</template>

<script lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue';
import { disconnectGlobalSocket, initializeGlobalSocket } from './ts/networking/networking.client-websocket';
import { currentPageState, goToState, pages, setupTransitionFunctions } from './ts/page/page.page-manager';
import LoginOverlay from './globalComponents/LoginOverlay.vue';
import { eventBus } from './ts/page/page.event-bus';
import { PageState } from './ts/page/page.e-page-state';
import { checkUserAuthentication, clearClientState, login, showLoginForm } from './ts/networking/networking.auth';

export default {
  name: 'App',
  components: { LoginOverlay },
  setup() {
    const showLogin = ref<boolean>(false);
    const loginErrorMessage = ref<string>('');
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

    onMounted(() => {
      setupTransitionFunctions();
      if(checkUserAuthentication()){
        initializeGlobalSocket();
        joinRoomFromHash();
      }else{
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
        loginErrorMessage.value = error;
      }
    }

    return {
      showLogin,
      loginErrorMessage,
      currentComponent,
      roomId,
      handleJoinRoom,
      handleLeaveRoom,
      handleLogin,
    };
  },
}


</script>