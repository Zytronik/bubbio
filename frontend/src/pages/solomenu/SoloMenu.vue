<template>
  <section id="soloMenu" class="page menu">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="menu-wrapper">
        <button class="menu-btn" @click="goToState(PAGE_STATE.sprintPage)">
          <img src="@/img/icons/sprint.png" />
          <p>Sprint</p>
          <p class="desc">Go very very fast</p>
        </button>
        <button class="menu-btn" @click="goToState(PAGE_STATE.scorePage)">
          <img src="@/img/icons/score.png" />
          <p>Punktejagd</p>
          <p class="desc">Send as much attack, in limited time</p>
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { onMounted, ref } from 'vue';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';

export default {
  name: 'SoloMenu',
  components: { MenuBackButtons },
  setup() {
    const backButtonData = ref([
      { pageState: PAGE_STATE.multiMenu, iconSrc: require('@/img/icons/multi.png'), disabled: true },
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/solo.png'), disabled: false },
      { pageState: PAGE_STATE.settingsPage, iconSrc: require('@/img/icons/config.png'), disabled: true },
    ]);

    onMounted(() => {
      changeBackgroundTo('linear-gradient(45deg, rgba(96, 221, 43, 1) 0%, rgba(198, 63, 135, 1) 100%)');
    });

    return {
      goToState,
      PAGE_STATE,
      backButtonData,
      changeBackgroundTo,
    }
  }
};
</script>

<style scoped>
.back-buttons::before {
  background: linear-gradient(45deg, rgba(181, 43, 221, 1) 0%, rgba(198, 63, 63, 1) 100%);
}
</style>
