<template>
  <section id="startmenu" class="page">
    <button @click="logUserOut">Log Out (Temp)</button>
    <h1>StartMenu</h1>
    <button class="m-btn">Play Ranked (TODO)</button>
    <button class="m-btn" @click="goToState(PAGE_STATE.sprintPage)">Sprint</button>
    <button class="m-btn" @click="goToState(PAGE_STATE.roomListing)">Room Listing</button>
    <button class="m-btn" @click="goToState(PAGE_STATE.settingsPage)">Config Page</button>
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

<style scoped>
  #startmenu {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .m-btn {
    width: 50%;
    border: none;
    border-radius: 10px;
    font-size: 150%;
    padding: 15px 0;
    margin-bottom: 10px;
  }
</style>
