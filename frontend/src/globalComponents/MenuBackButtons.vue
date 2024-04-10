<template>
  <div class="menu-wrapper back-buttons" @click.self="getGoBackState()">
    <button v-for="(button, index) in buttonData" :key="index" class="menu-btn"
      :class="button.disabled ? 'disabled' : ''" @click="handleButtonClick(button)">
      <img :src="button.iconSrc" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue';
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { goToState } from '@/ts/page/page.page-manager';
import { backInput } from '@/ts/input/input.all-inputs';

interface ButtonData {
  iconSrc: string;
  pageState: PAGE_STATE;
  disabled: boolean;
}

export default defineComponent({
  name: 'MenuBackButtons',
  props: {
    buttonData: Array as PropType<ButtonData[]>,
    default: () => [],
    specialBehavior: Boolean,
  },
  setup(props, {emit}) {
    function handleButtonClick(btn: ButtonData) {
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
      if (props.specialBehavior) {
        emit('special-click-event');
        return;
      }
      const activeButton = (props.buttonData as ButtonData[]).find(btn => !btn.disabled);
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
