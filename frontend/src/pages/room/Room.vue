<template>
  <section id="room" class="page">
    <div class="page-wrapper">
      <div class="page-container">
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
        <button @click="startGame">Start Game (TODO)</button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, defineComponent, SetupContext } from 'vue';
import state from '@/ts/networking/networking.client-websocket';

interface Message {
  username: string;
  text: string;
}

interface User {
  clientId: string;
  username: string;
}

export default defineComponent({
  name: 'RoomPage',
  components: {},
  props: {
    roomId: {
      type: String
    }
  },
  setup(props, { emit }: SetupContext) {
    const chatMessages = ref<Message[]>([]);
    const messageInputField = ref('');
    const roomUserList = ref<User[]>([]);

    if (state.socket) {

      state.socket.on('message', (data: Message) => {
        chatMessages.value.push(data);
      });

      state.socket.on('updateFrontendRoomUserList', (data: User[]) => {
        roomUserList.value = data;
      });

      state.socket.on('disconnect', () => {
        leaveRoom();
        emit('leftRoom')
      });
    }

    function clearMessageInputField() {
      messageInputField.value = '';
    }

    function clearChat() {
      chatMessages.value = [];
    }

    function leaveRoom() {
      if (state.socket) {
        state.socket.emit('leaveRoom');
        removeHashFromUrl();
        clearChat();
      }
    }

    function sendMessage(msg: string) {
      if (msg.trim()) {
        if (state.socket) {
          state.socket.emit('message', { text: msg });
          clearMessageInputField();
        }
      }
    }

    function joinRoom() {
      clearChat();
      if (props.roomId?.trim()) {
        addHashToUrl(props.roomId);
        if (state.socket) {
          state.socket.emit('joinRoom', { roomId: props.roomId });
        }
      }
    }

    function addHashToUrl(roomId: string) {
      window.location.hash = roomId;
    }

    function removeHashFromUrl() {
      const urlWithoutRoom = window.location.href.split('#')[0];
      history.pushState({}, document.title, urlWithoutRoom);
    }

    function startGame() {
      console.log("startGame");
    }

    onUnmounted(() => {
      leaveRoom();
    });

    onMounted(() => {
      console.log('Vue app mounted | Room');
      joinRoom();
    });

    return { chatMessages, messageInputField, roomUserList, sendMessage, startGame, leaveRoom };
  },
});
</script>

<style scoped>
section .page-wrapper {
  background: rgb(19, 20, 142);
  background: linear-gradient(59deg, rgba(19, 20, 142, 1) 0%, rgba(97, 33, 33, 1) 100%);
}

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

#messageInputField {
  width: 100%;
}
</style>