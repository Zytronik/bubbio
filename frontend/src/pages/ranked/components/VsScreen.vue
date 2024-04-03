<template>
<p>heyo bin VS Screen</p>
</template>
  
<script lang="ts">
import { I_RANKED_MATCH_FOUND_CONFIRMATION, versusScreenData } from '@/ts/game/network/game.network.ranked';
import state from '@/ts/networking/networking.client-websocket';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'VsScreen',
  setup() {
    onMounted(() => {
      setTimeout(() => {
        if(state.socket && versusScreenData){
          state.socket.emit(I_RANKED_MATCH_FOUND_CONFIRMATION, versusScreenData.matchID);
        }
      }, 3000);
    });

    return {};
  },
});
</script>
  
<style scoped>
  

</style>

  