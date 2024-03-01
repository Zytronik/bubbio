<template>
  <section id="startmenu" class="menu page">
    <div class="page-wrapper">
      <div class="menu-wrapper">
        <button class="menu-btn" @click="goToState(PAGE_STATE.soloMenu)">
          <img src="@/img/icons/solo.png"/>
          <p>Solo</p>
          <p class="desc">Train yourself in different Modes</p>
        </button>
        <button class="menu-btn" @click="goToState(PAGE_STATE.multiMenu)">
          <img src="@/img/icons/multi.png"/>
          <p>Multi</p>
          <p class="desc">Play with friends and foes</p>
        </button>
        <button class="menu-btn" @click="goToState(PAGE_STATE.settingsPage)">
          <img src="@/img/icons/config.png"/>
          <p>Config</p>
          <p class="desc">Tweak & Customize your Game</p>
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
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
    }
  }
};
</script>

<style scoped>
section .page-wrapper,
body {
  background: rgb(181,43,221);
  background: linear-gradient(164deg, rgba(181,43,221,1) 0%, rgba(198,63,63,1) 100%);
}
</style>
