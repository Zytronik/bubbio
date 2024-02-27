<template>
  <section id="soloMenu" class="page menu">
    <div class="menu-wrapper">
      <button class="menu-btn" @click="goToState(PAGE_STATE.sprintPage)">
        <img src="@/img/icons/sprint.png" />
        <p>Sprint</p>
        <p class="desc">Go very very fast</p>
      </button>
    </div>
    <MenuBackButtons :buttonData="backButtonData" />
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/page.e-page-state';
import { goToState } from '@/ts/page/page.page-manager';
import { onMounted, ref } from 'vue';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';

export default {
  name: 'SoloMenu',
  components: { MenuBackButtons },
  setup() {
    const backButtonData = ref([
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/solo.png') },
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/multi.png') },
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/config.png') },
    ]);
    
    onMounted(() => {
      console.log('Vue app mounted | soloMenu');
    });

    return {
      goToState,
      PAGE_STATE,
      backButtonData,
    }
  }
};
</script>

<style scoped>
</style>
