<template>
  <section id="me" class="page">
    <h1>Me</h1>
    <button @click="setCurrentPage('StartMenu')">Go to Menu</button>
  </section>
</template>

<script lang="ts">
import { PropType } from 'vue';

export default {
  name: 'MePage',
  props: {
    setCurrentPage: {
      type: Function as PropType<(pageName: string) => void>,
      required: true
    }
  },
/*   setup() {


    return {
     
    };
  }, */
};
</script>

<style>
</style>
