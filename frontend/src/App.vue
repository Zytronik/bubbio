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
    const socket = io('ws://bubbio-2qce6.ondigitalocean.app/bubbio-backend', {
      reconnectionDelayMax: 10000,
    });

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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

input {
  width: 300px;
  padding: 5px;
  margin-top: 10px;
}
</style>
