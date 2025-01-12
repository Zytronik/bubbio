<template>
  <MenuLayout :backButtonData="backButtonData" :title="'Singleplayer'" :menuName="'soloMenu'" :menuButtonsData="menuButtonsData" />
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { goToState } from '@/ts/page/page.page-manager';
import MenuLayout from '@/globalComponents/MenuLayout.vue';
import { MenuButtonData } from '@/globalComponents/i/i-menuButtonData';
import { ref } from 'vue';

export default {
  name: 'SoloMenu',
  components: { MenuLayout },
  setup() {
    const backButtonData = ref([
      { pageState: PAGE_STATE.multiMenu, iconSrc: require('@/img/icons/multi.png'), disabled: true },
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/solo.png'), disabled: false },
      { pageState: PAGE_STATE.settingsPage, iconSrc: require('@/img/icons/config.png'), disabled: true },
    ]);

    const menuButtonsData = ref<MenuButtonData[]>([
      {
        title: "Sprint",
        desc: "Go very very fast",
        iconSrc: require(`@/img/icons/sprint.png`),
        pageState: PAGE_STATE.sprintPage,
        bigButton: true,
      },
      {
        title: "Highscore",
        desc: "Send as much attack, in limited time",
        iconSrc: require(`@/img/icons/score.png`),
        pageState: PAGE_STATE.scorePage,
        bigButton: false,
        authIds: ["1", "2", "3"],
      },
      {
        title: "Pixitesting",
        desc: "Just for testing",
        iconSrc: require(`@/img/icons/pixi.png`),
        pageState: PAGE_STATE.pixiTest,
        bigButton: false,
        authIds: ["1", "2", "3"],
      }
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
