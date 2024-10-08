<template>
  <h1>Score</h1>
  <button @click="setPage(PAGE.soloMenu)">Back</button>
</template>

<script lang="ts">
import { PAGE } from '@/ts/_constant/pages';
import { setPage } from '@/ts/page/pageManager';

export default {
  name: 'ScorePage',
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
