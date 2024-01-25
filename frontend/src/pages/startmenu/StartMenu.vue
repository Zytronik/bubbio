<template>
  <section id="startmenu" class="page">
    <h1>StartMenu</h1>
    <button @click="goToState(PageState.settingsPage)">Go to Config Page</button>
    <button @click="goToState(PageState.roomListing)">Go to RoomListing</button>
    <button @click="goToState(PageState.myPage)">Go to My Page</button>
    <button @click="goToState(PageState.gamePage)">Go to Game</button>
  </section>
</template>

<script lang="ts">
import { PageState } from '@/ts/page/page.e-page-state';
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
      PageState
    }
  }
};
</script>

