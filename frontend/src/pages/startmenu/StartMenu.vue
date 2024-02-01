<template>
  <section id="startmenu" class="page">
    <button @click="logUserOut">Log Out</button>
    <h1>StartMenu</h1>
    <button @click="goToState(PAGE_STATE.settingsPage)">Go to Config Page</button>
    <button @click="goToState(PAGE_STATE.roomListing)">Go to RoomListing</button>
    <button @click="goToState(PAGE_STATE.myPage)">Go to My Page</button>
    <button @click="goToState(PAGE_STATE.gamePage)">Go to Game</button>
    <button @click="goToState(PAGE_STATE.sprintPage)">Go to Sprint</button>
  </section>
</template>

<script lang="ts">
import { logUserOut } from '@/ts/networking/networking.auth';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';
import { goToState } from '@/ts/page/page.page-manager';
import { onMounted } from 'vue';

export default {
  name: 'StartMenu',

  setup() {
    onMounted(() => {
      console.log('Vue app mounted | MainMenu');
    });

    return {
      goToState,
      PAGE_STATE,
      logUserOut,
    }
  }
};
</script>

