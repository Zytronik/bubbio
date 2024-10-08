<template>
  <div class="pageTitle">
    <h1><span class="text-noWhiteSpaces">B</span><span class="text-noWhiteSpaces">lubb.io</span></h1>
  </div>
  <div class="menuWrapper">
    <div v-for="(button, index) in menuButtonsData" :key="index" :class="[
      'menuBtn',
      button.title.toLowerCase().replace(/\s+/g, '-'),
      { 'shortMenuBtn': !button.bigButton },
      { 'disabledMenuBtn': isButtonDisabled(button) }
    ]" v-bind="getMenuButtonAttributes(button)">
      <div>
        <div class="text">
          <p class="firstLetter text-noWhiteSpaces">{{ button.title[0] }}</p>
          <p>
            <span class="text-noWhiteSpaces">{{ button.title.slice(1) }}</span>
            <span class="desc">{{ button.desc }}</span>
          </p>
        </div>
        <img :src="button.iconSrc" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PAGE } from '@/ts/_constant/pages';
import { setPage } from '@/ts/page/pageManager';
import { ref } from 'vue';
import { MenuButton } from '@/ts/_interface/menuButton';
import { getMenuButtonAttributes, isButtonDisabled } from '@/ts/page/menuButtons';

export default {
  name: 'StartMenu',
  components: {},
  setup() {
    const menuButtonsData = ref<MenuButton[]>([
      {
        title: "Multiplayer",
        desc: "Play with friends and foes",
        iconSrc: require(`@/assets/img/icons/multi.png`),
        page: PAGE.multiMenu,
        bigButton: true,
      },
      {
        title: "Singleplayer",
        desc: "Train yourself in different Modes",
        iconSrc: require(`@/assets/img/icons/solo.png`),
        page: PAGE.soloMenu,
        bigButton: false,
      },
      {
        title: "Configuration",
        desc: "Tweak & Customize your Game",
        iconSrc: require(`@/assets/img/icons/config.png`),
        page: PAGE.settings,
        bigButton: false,
      }
    ]);

    return {
      menuButtonsData,
      PAGE,
      setPage,
      isButtonDisabled,
      getMenuButtonAttributes,
    };
  },
};
</script>

<style scoped></style>
