<template>
  <div id="app">
    <div>
      <h1>Home</h1>
      <h2 v-if="isInRoom">Chat</h2>
      <div v-if="isInRoom" v-for="msg in messages" :key="msg.id">
        {{ msg.user }}: {{ msg.text }}
      </div><br>
      <div>
        <input v-if="isInRoom" v-model="message" @keyup.enter="sendMessage" placeholder="Type your message" />
      </div>
      <div>
        <input v-if="!isInRoom" v-model="roomId" placeholder="Room ID" />
        <button v-if="!isInRoom" @click="joinRoom">Join Room</button>
        <p v-if="!isInRoom">- or -</p>
        <button v-if="!isInRoom" @click="createRoom">Create & Join New Room</button>
        <button v-if="isInRoom" @click="leaveRoom">Leave Room</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import io from 'socket.io-client';

export default {
  name: 'App',
  setup() {
    let messages = ref([]);
    const message = ref('');
    const roomId = ref('');
    const isInRoom = ref(false);

    const host = window.location.host;
    let serverURL = "";
    let ioOptions = {
      path: "/blubbio-backend/socket.io",
    }
    if (host === "localhost:8080") {
      serverURL = "http://localhost:3000/";
      ioOptions = {};
    }

    const socket = io(serverURL, ioOptions);

    const sendMessage = () => {
      socket.emit('message', { text: message.value });
      message.value = '';
    };

    const createRoom = () => {
      const newRoomId = Math.random().toString(36).substring(7);
      socket.emit('joinRoom', { roomId: newRoomId });
      roomId.value = newRoomId;
      isInRoom.value = true;
      addHashToUrl(newRoomId);
    };

    const joinRoom = () => {
      socket.emit('joinRoom', { roomId: roomId.value });
      isInRoom.value = true;
      addHashToUrl(roomId.value);
    };

    const leaveRoom = () => {
      socket.emit('leaveRoom');
      roomId.value = '';
      isInRoom.value = false;
      removeHashFromUrl();
      messages.value = [];
    };

    function addHashToUrl(roomId) {
      window.location.hash = roomId;
    }

    function removeHashFromUrl() {
      const urlWithoutRoom = window.location.href.split('#')[0];
      history.pushState({}, document.title, urlWithoutRoom);
    }

    socket.on('message', (data) => {
      console.log(data);
      messages.value.push(data);
    });

    onMounted(() => {
      console.log('Vue app mounted');
      const urlRoomId = window.location.hash.substring(1);
      if (urlRoomId) {
        roomId.value = urlRoomId;
        isInRoom.value = true;
        joinRoom();
      }

    });


    return {
      messages,
      message,
      sendMessage,
      createRoom,
      roomId,
      joinRoom,
      leaveRoom,
      isInRoom,
    };
  },
};
</script>

<style>
input {
  width: 300px;
  padding: 5px;
  margin-top: 10px;
}

button {
  margin-top: 10px;
}
</style>
