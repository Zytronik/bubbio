<template>
  <article id="app">
 <!--  <LoginOverlay v-if="showLogin" @login="handleLogin" /> -->
  <component :is="currentComponent" 
    :room-id="roomId"
    :set-current-page="setCurrentPage" 
    @joinedRoom="handleJoinRoom"
    @leftRoom="handleLeaveRoom"
  ></component>
</article>

</template>

<script lang="ts">
import { ref, computed, watchEffect, Ref, onMounted, onUnmounted } from 'vue';
import { Page } from './interfaces/interfaces.page';
import StartMenu from './pages/startmenu/StartMenu.vue';
import Room from './pages/room/Room.vue';
import Game from './pages/room/components/Game.vue';
import Config from './pages/config/Config.vue';
import RoomListing from './pages/roomListing/RoomListing.vue';
import Me from './pages/me/Me.vue';
import { socket } from './networking/clientWebsocket';
import LoginOverlay from './globalComponents/LoginOverlay.vue';
import { httpClient } from './networking/httpClient';

export default {
  name: 'App',
  components: { LoginOverlay },
  setup() {
    const showLogin = ref<boolean>(true);
    const roomId = ref<string>('');
    const randomReconnectString = ref<string>('');
    const pages: Page[] = [
      { name: 'StartMenu', component: StartMenu },
      { name: 'RoomListing', component: RoomListing },
      { name: 'Room', component: Room },
      { name: 'Me', component: Me },
      { name: 'Config', component: Config },
      { name: 'Game', component: Game },
    ];

    const currentComponentIndex: Ref<number> = ref(0);

    const currentComponent = computed(() => pages[currentComponentIndex.value].component);

    watchEffect(() => {
      // Update document title with the original HTML title and the name of the current page
      document.title = `${document.title.split('|')[0]} | ${pages[currentComponentIndex.value].name}`;
    });

    function setCurrentPage(pageName: string) {
      const pageIndex = pages.findIndex(p => p.name === pageName);
      if (pageIndex !== -1) {
        currentComponentIndex.value = pageIndex;
      }
    }

    function handleJoinRoom(rId: string) {
      roomId.value = rId;
      randomReconnectString.value = Math.random().toString(36).substring(10);
      setCurrentPage('Room');
    }

    function handleLeaveRoom(){
      roomId.value = '';
      setCurrentPage('RoomListing');
    }

    function getRoomIdFromHash() {
      return window.location.hash.substring(1);
    }

    function joinRoomFromHash(){
      const roomId = getRoomIdFromHash();
      if (roomId) {
        handleJoinRoom(roomId);
      }
    }

    onMounted(() => {
      console.log('Vue app mounted');
      socket.connect();
      joinRoomFromHash();
    });

    onUnmounted(() => {
      console.log('Vue app unmounted');
      socket.disconnect();
    });

    async function login(username: string, password: string): Promise<boolean> {
      try {
        const response = await httpClient.post('/auth/login', { username, password });
        return response.data === 'Login Successful';
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    }

    async function handleLogin(username: string, password: string) {
      const isSuccess = await login(username, password);
      if (isSuccess) {
        console.log('Login successful. Hiding login component.');
        showLogin.value = false;
      } else {
        console.log('Login failed.');
      }
    }

    return {
      currentComponent,
      setCurrentPage,
      roomId,
      handleJoinRoom,
      handleLeaveRoom,
      showLogin,
      handleLogin,
    };
  },
}


</script>
