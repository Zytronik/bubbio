<template id="room" class="page">
  <div>
    <h3>Users in Room: {{ roomId }}</h3>
    <div>
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
    <button @click="$emit('leftRoom')">Leave Room</button>
    <button @click="startGame">Start Game</button>
    <Game v-if="gameOnGoing" />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, defineComponent, SetupContext } from 'vue';
import Game from '../game/Game.vue';
import { socket } from '@/ts/networking/networking.client-websocket';

interface Message {
  username: string;
  text: string;
}

interface User {
  clientId: string;
  username: string;
}

export default defineComponent( {
  name: 'RoomPage',
  components: { Game },
  props: {
    roomId: {
      type: String
    }
  },
  setup(props, { emit }: SetupContext) {
    const chatMessages = ref<Message[]>([]);
    const messageInputField = ref('');
    const roomUserList = ref<User[]>([]);
    const gameOnGoing = ref(false);

    socket.on('message', (data: Message) => {
      chatMessages.value.push(data);
    });

    socket.on('updateFrontendRoomUserList', (data: User[]) => {
      roomUserList.value = data;
    });

    function sendMessage(msg: string){
      if(msg.trim()){
        socket.emit('message', { text: msg });
        clearMessageInputField();
      }
    }

    function clearMessageInputField(){
      messageInputField.value = '';
    }

    function clearChat(){
      chatMessages.value = [];
    }

    function leaveRoom() {
      socket.emit('leaveRoom');
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

    function startGame(){
      gameOnGoing.value = true;
    }

    onUnmounted(() => {
      leaveRoom();
    });

    function joinRoom(){
      clearChat();
      if(props.roomId?.trim()){
        addHashToUrl(props.roomId);
        socket.emit('joinRoom', { roomId: props.roomId });
      }
    }

    socket.on('disconnect', () => {
      leaveRoom();
      emit('leftRoom')
    });

    onMounted(() => {
      console.log('Vue app mounted | Room');     
      joinRoom(); 
    });

    return { chatMessages, messageInputField, roomUserList, sendMessage, gameOnGoing, startGame, leaveRoom };
  },
});
</script>

<style>
input {
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
</style>../../ts/networking/clientWebsocket