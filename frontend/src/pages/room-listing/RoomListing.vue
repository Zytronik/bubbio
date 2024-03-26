<template>
  <section id="roomListing" class="room-listing page">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="page-container">
        <div class="room-actions">
          <input v-model="roomId" placeholder="Room ID" />
          <button @click="joinRoom(roomId)">Join Room</button>
          <p>- or -</p>
          <button @click="createRoom()">Create & Join New Room</button>
        </div>
        <div class="active-rooms">
          <h2>Active Rooms</h2>
          <ul v-if="activeRooms.length > 0">
            <li v-for="room in activeRooms" :key="room.roomId">
              <button @click="joinRoom(room.roomId)">
                <span class="room-id">Room ID: {{ room.roomId }}</span>
                <span class="user-count">Users: {{ room.userCount }}</span>
              </button>
            </li>
          </ul>
          <p v-else>No active rooms available.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import state from '@/ts/networking/networking.client-websocket';
import { ref, SetupContext, onMounted } from 'vue';
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';

interface ActiveRoomInfo {
  roomId: string;
  userCount: number;
}

export default {
  name: 'RoomListing',
  components: { MenuBackButtons },
  setup(_: unknown, { emit }: SetupContext) {
    const roomId = ref<string>('');
    const activeRooms = ref<ActiveRoomInfo[]>([]);
    const backButtonData = ref([
      { pageState: PAGE_STATE.rankedPage, iconSrc: require('@/img/icons/ranked.png') , disabled: true},
      { pageState: PAGE_STATE.multiMenu, iconSrc: require('@/img/icons/rooms.png') , disabled: false},
    ]);

    function createRoom() {
      const newRoomId: string = Math.random().toString(36).substring(7);
      joinRoom(newRoomId);
    }

    function joinRoom(roomId: string) {
      if (roomId) {
        emit('joinedRoom', roomId);
      }
    }

    if (state.socket) {
      state.socket.on('updateActiveRooms', (rooms: ActiveRoomInfo[]) => {
        activeRooms.value = rooms;
      });

      state.socket.on('disconnect', () => {
        activeRooms.value = [];
      });
    }

    function fetchActiveRooms() {
      if (state.socket) {
        state.socket.emit('updateActiveRooms');
      }
    }

    onMounted(() => {
      changeBackgroundTo('linear-gradient(45deg, rgba(209, 25, 114, 1) 0%, rgba(45, 19, 19, 1) 100%)');
      fetchActiveRooms();
    });

    return {
      roomId,
      joinRoom,
      createRoom,
      activeRooms,
      goToState,
      PAGE_STATE,
      backButtonData,
      changeBackgroundTo,
    };
  },
};
</script>

<style scoped>
.back-buttons::before  {
  background: linear-gradient(45deg, rgba(43,221,185,1) 0%, rgba(198,63,119,1) 100%); 
}

.room-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
}

.room-input {
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
}

.join-button,
.create-button {
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
}

.active-rooms h2 {
  text-align: center;
}

.active-rooms ul {
  list-style: none;
  padding: 0;
}

.room-id {
  font-weight: bold;
}

.user-count {
  margin-left: 15px;
}

.active-rooms button {
  background: none;
  border: none;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  width: 100%;
}

a {
  text-decoration: none;
  color: white;
}

.active-rooms p {
  text-align: center;
}
</style>