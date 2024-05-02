<template>
  <section id="startmenu" class="menu page">
    <div class="page-wrapper">
      <div class="menu-wrapper">
        <div class="menu-title">
          <h1><span>B</span><span>lubb.io</span></h1>
        </div>
        <div class="menu-btn multiplayer" @click="goToState(PAGE_STATE.multiMenu)">
          <div>
            <div class="text">
              <span>M</span>
              <p>
                <span>ultiplayer</span>
                <span class="desc">Play with friends and foes</span>
              </p>
            </div>
            <img src="@/img/icons/multi.png" />
          </div>
        </div>
        <div class="menu-btn singleplayer" @click="goToState(PAGE_STATE.soloMenu)">
          <div>
            <div class="text">
              <span>S</span>
              <p>
                <span>ingleplayer</span>
                <span class="desc">Train yourself in different Modes</span>
              </p>
            </div>
            <img src="@/img/icons/solo.png" />
          </div>
        </div>
        <div class="menu-btn config" @click="goToState(PAGE_STATE.settingsPage)">
          <div>
            <div class="text">
              <span>C</span>
              <p>
                <span>onfig</span>
                <span class="desc">Tweak & Customize your Game</span>
              </p>
            </div>
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
      //changeBackgroundTo("linear-gradient(45deg, rgba(181,43,221,1) 0%, rgba(198,63,63,1) 100%)");
      changeBackgroundTo("rgb(128, 128, 128)");
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
