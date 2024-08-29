<template>
  <MenuLayout :backButtonData="[]" :title="'blubb.io'" :menuName="'startmenu'" :menuButtonsData="menuButtonsData" />
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import MenuLayout from '@/globalComponents/MenuLayout.vue';
import { MenuButtonData } from '@/globalComponents/i/i-menuButtonData';
import { ref } from 'vue';

export default {
  name: 'StartMenu',
  components: { MenuLayout },
  setup() {
    const menuButtonsData = ref<MenuButtonData[]>([
      {
        title: "Multiplayer",
        desc: "Play with friends and foes",
        iconSrc: require(`@/img/icons/multi.png`),
        pageState: PAGE_STATE.multiMenu,
        bigButton: true,
      },
      {
        title: "Singleplayer",
        desc: "Train yourself in different Modes",
        iconSrc: require(`@/img/icons/solo.png`),
        pageState: PAGE_STATE.soloMenu,
        bigButton: false,
      },
      {
        title: "Configuration",
        desc: "Tweak & Customize your Game",
        iconSrc: require(`@/img/icons/config.png`),
        pageState: PAGE_STATE.settingsPage,
        bigButton: false,
      }
    ]);

    return {
      goToState,
      PAGE_STATE,
      changeBackgroundTo,
      menuButtonsData,
    }
  }
};
</script>

<style scoped></style>
@/ts/constant/page.e-page-state@/ts/_interface/i-menuButtonData