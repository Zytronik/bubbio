<template>
  <section id="multiMenu" class="page menu">
    <div class="menu-wrapper">
      <button class="menu-btn" @click="goToState(PAGE_STATE.roomListing)">
        <img src="@/img/icons/rooms.png" />
        <p>Room Listing</p>
        <p class="desc">Create or Join  Rooms</p>
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
  name: 'MultiMenu',
  components: { MenuBackButtons },
  setup() {
    const backButtonData = ref([
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/solo.png') },
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/multi.png') },
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/config.png') },
    ]);

    onMounted(() => {
      console.log('Vue app mounted | multiMenu');
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