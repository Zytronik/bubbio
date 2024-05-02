<template>
  <section id="startmenu" class="menu page">
    <div class="page-wrapper">
      <div class="menu-wrapper">
        <div class="menu-btn" @click="goToState(PAGE_STATE.multiMenu)">
          <div>
            <p>Multi</p>
            <p class="desc">Play with friends and foes</p>
            <img src="@/img/icons/multi.png" />
          </div>
        </div>
        <div class="menu-btn" @click="goToState(PAGE_STATE.soloMenu)">
          <div>
            <p>Solo</p>
            <p class="desc">Train yourself in different Modes</p>
            <img src="@/img/icons/solo.png" />
          </div>
        </div>
        <div class="menu-btn" @click="goToState(PAGE_STATE.settingsPage)">
          <div>
            <p>Config</p>
            <p class="desc">Tweak & Customize your Game</p>
            <img src="@/img/icons/config.png" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { onMounted } from 'vue';

export default {
  name: 'StartMenu',

  setup() {
    onMounted(() => {
      changeBackgroundTo("linear-gradient(45deg, rgba(181,43,221,1) 0%, rgba(198,63,63,1) 100%)");
    });

    return {
      goToState,
      PAGE_STATE,
      changeBackgroundTo,
    }
  }
};
</script>

<style scoped></style>
