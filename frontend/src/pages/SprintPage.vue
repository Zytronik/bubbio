<template>
  <h1>Sprint</h1>
  <button v-on:click="startSprint()">testma game</button>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { PAGE } from '@/ts/_enum/page';
import { setPage } from '@/ts/page/pageManager';
import { onMounted } from 'vue';

export default {
  name: 'SprintPage',
  components: {},
  setup() {
    onMounted(async () => {
      useGameStore().setupSprint();
      
    });

    function startSprint(): void {
      useGameStore().startGame();
    }

    return {
      setPage,
      PAGE,
      startSprint,
    };
  },
};
</script>

<style scoped></style>
