<template>
  <div class="menu-wrapper back-buttons">
    <button
      v-for="(button, index) in buttonData"
      :key="index"
      class="menu-btn"
      @click="goToState(button.pageState)"
    >
      <img :src="button.iconSrc" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';
import { goToState } from '@/ts/page/page.page-manager';

interface ButtonData {
  iconSrc: string;
  pageState: PAGE_STATE;
}

export default defineComponent({
  name: 'MenuBackButtons',
  props: {
    buttonData: Array as PropType<ButtonData[]>,
  },
  setup() {
    return {
      goToState,
      PAGE_STATE,
    };
  },
});
</script>

<style scoped></style>
