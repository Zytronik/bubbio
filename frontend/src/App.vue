<template>
  <article id="app">
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
import Config from './pages/config/Config.vue';
import RoomListing from './pages/roomListing/RoomListing.vue';
import Me from './pages/me/Me.vue';
import { socket } from './networking/clientWebsocket';

export default {
  name: 'App',
  setup() {
    const roomId = ref<string>('');
    const randomReconnectString = ref<string>('');
    const pages: Page[] = [
      { name: 'StartMenu', component: StartMenu },
      { name: 'RoomListing', component: RoomListing },
      { name: 'Room', component: Room },
      { name: 'Me', component: Me },
      { name: 'Config', component: Config },
    ];

    const currentComponentIndex: Ref<number> = ref(0);

    const currentComponent = computed(() => pages[currentComponentIndex.value].component);
    const currentComponentIndex: Ref<number> = ref(0);
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
      

    return {
      currentComponent,
      setCurrentPage,
      roomId,
      handleJoinRoom,
      handleLeaveRoom,
    };
  }
}
const inputReader = new InputReader();
</script>

