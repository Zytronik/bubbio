<template>
  <div id="app">
    <!-- <LoginForm v-if="!isInRoom" /> -->
    <div>
      <h1>Home</h1>
      <h3 v-if="isInRoom">Users</h3>
      <div v-if="isInRoom">
        <div v-for="user in users" :key="user.socketId">
          {{ user }}
        </div>
      </div>
      <h2 v-if="isInRoom">Chat</h2>
      <div v-if="isInRoom">
        <div v-for="(msg, i) in messages" :key="i">
          {{ msg.user }}: {{ msg.text }}
        </div>
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

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { socket } from '../../networking/clientWebsocket';
/* import LoginForm from './components/LoginForm.vue'; */

export default {
  components: {
    /* LoginForm, */
  },
  name: 'HomePage',
  setup() {
    interface User {
      socketId: string;
    }

    interface Message {
      user: string;
      text: string;
    }

    let messages = ref<Message[]>([]);
    let users = ref<User[]>([]);
    const message = ref('');
    const roomId = ref('');
    const isInRoom = ref(false);

    const sendMessage = () => {
      socket.emit('message', { text: message.value });
      message.value = '';
    };

    const createRoom = () => {
      const newRoomId: string = Math.random().toString(36).substring(7);
      roomId.value = newRoomId;
      joinRoom();
    };




    const joinRoom = () => {
      clearMessage();
      socket.emit('joinRoom', { roomId: roomId.value });
      isInRoom.value = true;
      addHashToUrl(roomId.value);
      console.log(message.value);
      console.log(users.value);
    };

    const clearMessage = () => {
      messages.value = [];
    }

    socket.on('joinRoom', (data) => {
      users.value = data.users;
      console.log("joined room");
    });

    const leaveRoom = () => {
      socket.emit('leaveRoom');
      roomId.value = '';
      isInRoom.value = false;
      removeHashFromUrl();
      clearMessage();
    };

    socket.on('leaveRoom', (data) => {
      users.value = data.users;
      clearMessage();
      console.log(message.value);
      console.log(users.value);
    });

    function addHashToUrl(roomId: string) {
      window.location.hash = roomId;
    }

    function removeHashFromUrl() {
      const urlWithoutRoom = window.location.href.split('#')[0];
      history.pushState({}, document.title, urlWithoutRoom);
    }

    socket.on('message', (data: any) => {
      messages.value.push(data);
    });

    onMounted(() => {
      console.log('Vue app mounted | home');
      socket.connect();
      const urlRoomId = window.location.hash.substring(1);
      if (urlRoomId) {
        roomId.value = urlRoomId;
        isInRoom.value = true;
        joinRoom();
      }
    });

    onUnmounted(() => {
      console.log('Vue app unmounted | home');
      /* socket.disconnect(); */
      socket.emit('leaveRoom');
      if (isInRoom.value) {
        roomId.value = '';
        isInRoom.value = false;
        removeHashFromUrl();
        messages.value = [];
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
      users,
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
