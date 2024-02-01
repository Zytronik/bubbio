<template>
  <section id="config" class="page">
    <h1>Config</h1>
    <button @click="goToState(PAGE_STATE.mainMenu)">Go to Menu</button>
  </section>
</template>

<script lang="ts">
import { goToState } from '@/ts/page/page.page-manager';
import { onMounted } from 'vue';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';

export default{
  name: 'ConfigPage',
  setup() {
    onMounted(() => {
      console.log('Vue app mounted | Config Page');
    });

    return {
      PAGE_STATE,
      goToState,
    }
  }
}
</script>

<style>
</style>
