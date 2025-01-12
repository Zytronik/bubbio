<template>
  <div class="menu-wrapper back-buttons" @click.self="getGoBackState()">
    <div v-for="(button, index) in buttonData" :key="index" class="menu-btn" :class="button.disabled ? 'disabled' : ''"
      @click="handleButtonClick(button)" @mouseenter="playSound('menu_hover')">
      <div>
        <div class="text"></div>
        <img :src="button.iconSrc" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue';
import { currentPageState, goToState } from '@/ts/page/page.page-manager';
import { backInput } from '@/ts/input/input.all-inputs';
import { BackButtonData } from './i/i-buttonData';
import { playSound } from '@/ts/asset/asset.howler-load';
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';

export default defineComponent({
  name: 'MenuBackButtons',
  props: {
    buttonData: Array as PropType<BackButtonData[]>,
    specialBehavior: Boolean,
  },
  setup(props, { emit }) {
    function handleButtonClick(btn: BackButtonData) {
      playSound('menu_back');
      if (btn.disabled) {
        goToState(btn.pageState);
      } else {
        if (props.specialBehavior) {
          emit('special-click-event');
          return;
        }
        goToState(btn.pageState, false);
        let backButtons = document.querySelector("div.back-buttons");
        if (backButtons) {
          backButtons.classList.add('shrink');
        }
      }
    }

    onMounted(() => {
      backInput.fire = getGoBackState;
    });

    function getGoBackState() {
      if(currentPageState.value === PAGE_STATE.mainMenu) {
        return;
      }
      playSound('menu_back');
      if (props.specialBehavior) {
        emit('special-click-event');
        return;
      }
      const activeButton = (props.buttonData as BackButtonData[]).find(btn => !btn.disabled);
      if (activeButton) {
        goToState(activeButton.pageState, false);
        let backButtons = document.querySelector("div.back-buttons");
        if (backButtons) {
          backButtons.classList.add('shrink');
        }
      }
    }

    return {
      handleButtonClick,
      getGoBackState,
      playSound,
    };
  },
});
</script>

<style scoped>
@keyframes shrinkWidth {
  from {
    width: 7vw;
  }

  to {
    width: 0;
    opacity: 0;
  }
}

.shrink {
  animation: shrinkWidth 0.4s forwards;
}
</style>
