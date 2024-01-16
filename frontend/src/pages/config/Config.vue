<template>
  <section id="config" class="page">
    <h1>Config</h1>
    <button @click="setCurrentPage('StartMenu')">Go to Menu</button>
  </section>
</template>

<script lang="ts">
import { PropType, onMounted } from 'vue';

export default{
  name: 'ConfigPage',
  props: {
    setCurrentPage: {
      type: Function as PropType<(pageName: string) => void>,
      required: true
    }
  },
  setup() {
    onMounted(() => {
      console.log('Vue app mounted | MainMenu');
    });
  }
}
</script>

<style>
</style>
