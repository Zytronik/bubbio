<template id="roomListing" class="page">
  <div class="room-listing">
    <div class="room-actions">
      <input v-model="roomId" placeholder="Room ID" />
      <button @click="joinRoom(roomId)">Join Room</button>
      <p>- or -</p>
      <button @click="createRoom()">Create & Join New Room</button>
      <button @click="setCurrentPage('StartMenu')">Go to Menu</button>
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
</template>

<script lang="ts">
import { ref, SetupContext, onMounted, PropType } from 'vue';
import { socket } from '../../networking/clientWebsocket';

interface ActiveRoomInfo {
  roomId: string;
  userCount: number;
}

export default {
  name: 'RoomListing',
  props: {
    setCurrentPage: {
      type: Function as PropType<(pageName: string) => void>,
      required: true
    }
  },
  setup(_: unknown, { emit }: SetupContext) {
    const roomId = ref<string>('');
    const activeRooms = ref<ActiveRoomInfo[]>([]);

    function createRoom() {
      const newRoomId: string = Math.random().toString(36).substring(7);
      joinRoom(newRoomId);
    }

    function joinRoom(roomId: string) {
      emit('joinedRoom', roomId);
    }

    socket.on('updateActiveRooms', (rooms: ActiveRoomInfo[]) => {
      activeRooms.value = rooms;
    });

    function fetchActiveRooms() {
      socket.emit('updateActiveRooms');
    }

    socket.on('disconnect', () => {
      activeRooms.value = [];
    });

    onMounted(() => {
      console.log('Vue app mounted | Room Listing');
      fetchActiveRooms();
    });

    return { roomId, joinRoom, createRoom, activeRooms };
  },
};
</script>

<style scoped>
.room-listing {
  padding: 20px;
  max-width: 600px;
  margin: auto;
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
  margin-bottom: 10px;
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
