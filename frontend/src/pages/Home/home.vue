<template>
  <div id="app">
    <div>
      <h1>Home</h1>
      <h2>Chat</h2>
      <div v-for="msg in messages" :key="msg.id">
        {{ msg.user }}: {{ msg.text }}
      </div>
      <div>
        <input v-model="message" @keyup.enter="sendMessage" placeholder="Type your message" />
      </div>
      <div>
        <button @click="createRoom">Create Room</button>
        <input v-model="roomId" placeholder="Enter Room ID" />
        <button @click="joinRoom">Join Room</button>
        <button @click="leaveRoom">Leave Room</button>
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
    const messages = ref([]);
    const message = ref('');
    const roomId = ref('');

    const host = window.location.host;
    let serverURL = "";
    let ioOptions = {
      path: "/blubbio-backend/socket.io",
    }
    if(host === "localhost:8080"){
      serverURL = "http://localhost:3000/";
      ioOptions = {};
    }

    const socket = io(serverURL, ioOptions);

    const sendMessage = () => {
      socket.emit('message', { user: 'User', text: message.value });
      message.value = '';
    };

    const createRoom = () => {
      const newRoomId = Math.random().toString(36).substring(7);
      socket.emit('joinRoom', newRoomId);
      roomId.value = newRoomId;
    };

    const joinRoom = () => {
      socket.emit('joinRoom', roomId.value);
    };

    const leaveRoom = () => {
      socket.emit('leaveRoom');
      roomId.value = '';
    };

    socket.on('message', (data) => {
      messages.value.push(data);
    });

    onMounted(() => {
      console.log('Vue app mounted');
      const urlRoomId = window.location.hash.substring(1);
      if (urlRoomId) {
        roomId.value = urlRoomId;
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
