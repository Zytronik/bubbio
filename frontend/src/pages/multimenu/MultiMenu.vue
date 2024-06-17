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
        title: "Mm Simulation",
        desc: "Simulate Matchmaking",
        iconSrc: require(`@/img/icons/ranked.png`),
        pageState: PAGE_STATE.matchmakingSimulation,
        bigButton: false,
        authIds: ["1", "2", "3"],
      },
      {
        title: "Room Listing",
        desc: "Create or Join Rooms",
        iconSrc: require(`@/img/icons/rooms.png`),
        pageState: PAGE_STATE.roomListing,
        bigButton: false,
        authIds: ["1", "2", "3"],
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