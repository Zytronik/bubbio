<template>
  <section id="pixicanvas" class="page">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="page-container">
        <p>Test</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { changeBackgroundTo } from '@/ts/page/page.page-manager';
import { defineComponent, onMounted, ref } from 'vue';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';

export default defineComponent({
  name: 'PixiCanvas',
  components: { MenuBackButtons },
  setup() {
    const backButtonData = ref([
      { pageState: PAGE_STATE.soloMenu, iconSrc: require('@/img/icons/score.png'), disabled: false },
    ]);

    onMounted(() => {
      changeBackgroundTo('linear-gradient(45deg, rgba(43,156,221,1) 0%, rgba(198,141,63,1) 100%)');
    });

    return {
      backButtonData,
    }
  }
});
</script>

<style scoped>
.back-buttons::before {
  background: linear-gradient(45deg, rgba(96, 221, 43, 1) 0%, rgba(198, 63, 135, 1) 100%);
}
</style>