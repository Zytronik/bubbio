<template>
  <h1>{{ room?.name || 'Room' }}</h1>
  <ul>
    <li v-for="user in room?.users" :key="user.socketId">
      {{ user.username }} <span v-if="user.isHost">(Host)</span>
    </li>
  </ul>
  <button @click="leaveRoom">Leave Room</button>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useLobbyStore } from '@/stores/lobbyStore';
import { PAGE } from '@/ts/_enum/page';
import { transitionPageBackwardsAnimation } from '@/ts/animationCSS/transitionPageBackwards';

export default {
  name: 'RoomPage',
  setup() {
    const lobbyStore = useLobbyStore();
    const roomId = ref<string | null>(null);

    const room = computed(() => {
      return lobbyStore.lobbies.find(lobby => lobby.id === roomId.value) || null;
    });

    onMounted(async () => {
      const currentRoomId = getHash();

      if (currentRoomId && !roomId.value) {
        roomId.value = currentRoomId;

        if (!lobbyStore.lobbies.length) {
          await lobbyStore.fetchLobbies();
        }

        if (!room.value) {
          console.error('Room not found, redirecting to room listing.');
          transitionPageBackwardsAnimation(PAGE.roomListing);
        }
      } else {
        console.error('Invalid room ID, redirecting to room listing.');
        transitionPageBackwardsAnimation(PAGE.roomListing);
      }
    });

    onUnmounted(() => {
      if (roomId.value) {
        lobbyStore.leaveLobby(roomId.value);
        roomId.value = null;
      }
    });

    function leaveRoom() {
      if (roomId.value) {
        lobbyStore.leaveLobby(roomId.value);
        roomId.value = null;
        transitionPageBackwardsAnimation(PAGE.roomListing);
      }
    }

    function getHash(): string | null {
      return window.location.hash.replace('#', '') || null;
    }

    return {
      room,
      leaveRoom,
    };
  },
};
</script>
