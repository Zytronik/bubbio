<template>
  <h1>Multi Menu</h1>
  <button @click="setPage(PAGE.startMenu)">Home</button>
</template>

<script lang="ts">
import { PAGE } from '@/ts/_enum/page';
import { setPage } from '@/ts/page/pageManager';

export default {
  name: 'MultiMenu',
  components: {},
  setup() {
    return {
      setPage,
      PAGE,
    };
  },
};
</script>

<style scoped></style>
