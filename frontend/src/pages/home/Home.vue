<template>
  <section class="page" id="home">
    <!-- <LoginForm v-if="!isInRoom" /> -->
    <div>
      <h1>Lobby<span v-if="isInRoom">: {{ roomId }}</span></h1>

      <div class="inRoom" v-if="isInRoom">
        <h3 v-if="isInRoom">Users</h3>
        <div v-if="isInRoom">
          <span v-for="user in roomUserList" :key="user.clientId">
            {{ user.username }}, 
          </span> 
        </div>
        <h2>Chat</h2>
        <div id="chat">
          <div id="chatMessages">
            <div v-for="(msg, i) in chatMessages" :key="i">
              {{ msg.username }}: {{ msg.text }}
            </div>
          </div>
          <input id="messageInputField" v-model="messageInputField" @keyup.enter="sendMessage(messageInputField)"
            placeholder="Type your message" />
        </div>
        <button @click="leaveRoom">Leave Room</button>
      </div>

      <div class="notInRoom" v-if="!isInRoom">
        <input v-model="roomId" placeholder="Room ID" />
        <button @click="joinRoom">Join Room</button>
        <p>- or -</p>
        <button @click="createRoom">Create & Join New Room</button>
      </div>

    </div>
  </section>
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

    interface Message {
      username: string;
      text: string;
    }

    interface User {
      clientId: string;
      username: string;
    }

    type RoomUserList = User[];

    const chatMessages = ref<Message[]>([]);
    const messageInputField = ref();
    const roomId = ref<string>('');
    const isInRoom = ref<boolean>(false);
    const roomUserList = ref<RoomUserList>([]);

    socket.on('message', (data: Message) => {
      chatMessages.value.push(data);
    });

    socket.on('updateFrontendRoomUserList', (data: RoomUserList) => {
      roomUserList.value = data;
    });

    function sendMessage(msg: string){
      socket.emit('message', { text: msg });
      clearMessageInputField();
    }

    function createRoom(){
      const newRoomId: string = Math.random().toString(36).substring(7);
      roomId.value = newRoomId;
      joinRoom();
    }

    function joinRoom(){
      clearChat();
      socket.emit('joinRoom', { roomId: roomId.value });
      isInRoom.value = true;
      addHashToUrl(roomId.value);
    }

    function clearChat(){
      chatMessages.value = [];
    }

    function clearMessageInputField(){
      messageInputField.value = '';
    }

    function leaveRoom() {
      socket.emit('leaveRoom');
      roomId.value = '';
      isInRoom.value = false;
      removeHashFromUrl();
      clearChat();
    }

    function addHashToUrl(roomId: string) {
      window.location.hash = roomId;
    }

    function removeHashFromUrl() {
      const urlWithoutRoom = window.location.href.split('#')[0];
      history.pushState({}, document.title, urlWithoutRoom);
    }

    function getRoomIdFromHash() {
      return window.location.hash.substring(1);
    }

    onMounted(() => {
      console.log('Vue app mounted | home');
      socket.connect();
      const urlRoomId = getRoomIdFromHash();
      if (urlRoomId) {
        roomId.value = urlRoomId;
        joinRoom();
      }
    });

    onUnmounted(() => {
      console.log('Vue app unmounted | home');
      if (isInRoom.value) {
        leaveRoom();
      }
    });

    return {
      chatMessages,
      messageInputField,
      createRoom,
      roomId,
      joinRoom,
      leaveRoom,
      isInRoom,
      sendMessage,
      roomUserList,
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

#chat {
  text-align: left;
  max-width: 60%;
  margin: 0 auto;
  border: 1px solid white;
  padding: 15px 30px;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;

}

#chatMessages {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 25vh;
}

#messageInputField{
  width: 100%;
}
</style>
