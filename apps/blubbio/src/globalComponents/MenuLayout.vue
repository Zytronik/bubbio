<template>
  <section :id="menuName" class="menu page">
    <div class="menu-title">
      <h1><span class="text-noWhiteSpaces">{{ title[0] }}</span><span class="text-noWhiteSpaces">{{ title.slice(1)
          }}</span></h1>
    </div>
    <MenuBackButtons v-if="backButtonData && backButtonData.length > 0" :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="menu-wrapper">
        <div v-for="(button, index) in menuButtonsData" :key="index" :class="[
          'menu-btn',
          button.title.toLowerCase().replace(/\s+/g, '-'),
          { 'short-btn': !button.bigButton },
          { 'disabled-btn': isDisabled(button)}
        ]" 
         @mouseenter="playSound('menu_hover')" 
         v-bind="getButtonAttributes(button)">
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
import { PropType, computed, defineComponent } from 'vue';
import { BackButtonData } from './i/i-buttonData';
import { MenuButtonData } from './i/i-menuButtonData';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import eventBus from '@/ts/page/page.event-bus';
import { playSound } from '@/ts/asset/asset.howler-load';

export default defineComponent({
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
    const currentUserID = computed(() => {
      const userData = eventBus.getUserData();
      return userData && userData.id ? userData.id.toString() : null;
    });

    function isDisabled(button :MenuButtonData) {
      return button.authIds && (!currentUserID.value || !button.authIds.includes(currentUserID.value));
    }

    function handleButtonClick(button :MenuButtonData) {
      playSound('menu_front');
      goToState(button.pageState);
    }

    function getButtonAttributes(button: MenuButtonData) {
      return isDisabled(button) ? {} : { onClick: () => handleButtonClick(button) };
    }

    return {
      goToState,
      PAGE_STATE,
      changeBackgroundTo,
      handleButtonClick,
      playSound,
      isDisabled,
      getButtonAttributes,
    }
  }
});
</script>

<style scoped>
  .disabled-btn {
    filter: grayscale(80%);
    opacity: 0.3;
    pointer-events: none;
  }
</style>
