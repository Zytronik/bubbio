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
      </div>
    </div>
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
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/solo.png'), disabled: false },
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/multi.png'), disabled: true },
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/config.png'), disabled: true },
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
section .page-wrapper {
  background: rgb(96, 221, 43);
  background: linear-gradient(164deg, rgba(96, 221, 43, 1) 0%, rgba(198, 63, 135, 1) 100%);
}

.back-buttons::before  {
  background: rgb(181,43,221);
  background: linear-gradient(164deg, rgba(181,43,221,1) 0%, rgba(198,63,63,1) 100%); 
}
</style>
