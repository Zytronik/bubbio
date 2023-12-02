<template>
  <div id="app">
    <div>
      <h2>Chat</h2>
      <div v-for="msg in messages" :key="msg.id">
        {{ msg.user }}: {{ msg.text }}
      </div>
      <div>
        <input v-model="message" @keyup.enter="sendMessage" placeholder="Type your message" />
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
    const host = window.location.host;
    let serverURL = "";
    let ioOptions = {
      path: "/bubbio-backend/socket.io",
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

    socket.on('message', (data) => {
      messages.value.push(data);
    });

    onMounted(() => {
      console.log('Vue app mounted');
    });

    return {
      messages,
      message,
      sendMessage,
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
</style>
