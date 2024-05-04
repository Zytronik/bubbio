<!-- <template>
  <section id="multiMenu" class="page menu">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="menu-wrapper">
        <button class="menu-btn" @click="goToState(PAGE_STATE.rankedPage)">
          <img src="@/img/icons/ranked.png" />
          <p>Play Ranked</p>
          <p class="desc">Play ranked 1vs1</p>
        </button>
        <button class="menu-btn" @click="goToState(PAGE_STATE.roomListing)">
          <img src="@/img/icons/rooms.png" />
          <p>Room Listing</p>
          <p class="desc">Create or Join Rooms</p>
        </button>
      </div>
    </div>
  </section>
</template>
 -->

<template>
  <MenuLayout :backButtonData="backButtonData" :title="'Multiplayer'" :menuName="'multiMenu'"
    :menuButtonsData="menuButtonsData" />
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { goToState } from '@/ts/page/page.page-manager';
import { ref } from 'vue';
import MenuLayout from '@/globalComponents/MenuLayout.vue';
import { MenuButtonData } from '@/globalComponents/i/i-menuButtonData';

export default {
  name: 'MultiMenu',
  components: { MenuLayout },
  setup() {
    const backButtonData = ref([
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/multi.png'), disabled: false },
      { pageState: PAGE_STATE.soloMenu, iconSrc: require('@/img/icons/solo.png'), disabled: true },
      { pageState: PAGE_STATE.settingsPage, iconSrc: require('@/img/icons/config.png'), disabled: true },
    ]);

    const menuButtonsData = ref<MenuButtonData[]>([
      {
        title: "Play Ranked",
        desc: "Play ranked 1vs1",
        iconSrc: require(`@/img/icons/ranked.png`),
        pageState: PAGE_STATE.rankedPage,
        bigButton: true,
      },
      {
        title: "Room Listing",
        desc: "Create or Join Rooms",
        iconSrc: require(`@/img/icons/rooms.png`),
        pageState: PAGE_STATE.roomListing,
        bigButton: false,
      },
    ]);

    return {
      goToState,
      PAGE_STATE,
      backButtonData,
      menuButtonsData,
    }
  }
};
</script>

<style scoped>
</style>