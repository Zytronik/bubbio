<template>
  <div id="game" class="page">
    <h1>Game</h1>
  </div>
</template>

<script>
import { socket } from '../../clientWebsocket.js';
import { onMounted  } from 'vue';

export default {
  name: 'App',
  setup() {

    onMounted(() => {
      console.log('Vue app mounted | game');
      socket.on('generateQueue', (data) => {
        console.log(data);
      });

    });

  },
};
</script>

<style>

</style>
