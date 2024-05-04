<template>
  <section :id="menuName" class="menu page">
    <MenuBackButtons v-if="backButtonData && backButtonData.length > 0" :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="menu-wrapper">

        <div class="menu-title">
          <h1><span class="text-noWhiteSpaces">{{ title[0] }}</span><span class="text-noWhiteSpaces">{{ title.slice(1)
              }}</span></h1>
        </div>

        <div v-for="(button, index) in menuButtonsData" :key="index" :class="[
          'menu-btn',
          button.title.toLowerCase().replace(/\s+/g, '-'),
          { 'short-btn': !button.bigButton }
        ]" @click="goToState(button.pageState)">
          <div>
            <div class="text">
              <span class="text-noWhiteSpaces">{{ button.title[0] }}</span>
              <p>
                <span class="text-noWhiteSpaces">{{ button.title.slice(1) }}</span>
                <span class="desc">{{ button.desc }}</span>
              </p>
            </div>
            <img :src="button.iconSrc" />
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { PropType, onMounted } from 'vue';
import { BackButtonData } from './i/i-buttonData';
import { MenuButtonData } from './i/i-menuButtonData';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';

export default {
  name: 'MenuLayout',
  components: { MenuBackButtons },
  props: {
    title: {
      type: String,
      required: true,
    },
    backButtonData: {
      type: Array as PropType<BackButtonData[]>,
      required: false,
    },
    menuName: {
      type: String,
      required: true,
    },
    menuButtonsData: {
      type: Array as PropType<MenuButtonData[]>,
      required: true,
    },
  },
  setup() {
    onMounted(() => {
      changeBackgroundTo("rgb(100, 100, 100)");
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
