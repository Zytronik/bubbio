<template>
  <section id="config" class="page">
    <h1>Config</h1>
    <button @click="goToState(PageState.mainMenu)">Go to Menu</button>
  </section>
</template>

<script lang="ts">
import { goToState } from '@/ts/page/page.page-manager';
import { onMounted } from 'vue';
import { PageState } from '@/ts/page/page.e-page-state';

export default{
  name: 'ConfigPage',
  setup() {
    onMounted(() => {
      console.log('Vue app mounted | Config Page');
    });

    return {
      PageState,
      goToState,
    }
  }
}
</script>

<style>
</style>
