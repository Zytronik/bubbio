<template>
  <h1>Sprint</h1>
  <button @click="setPage(PAGE.soloMenu)">Back</button>
</template>

<script lang="ts">
import { PAGE } from '@/ts/_constant/pages';
import { setPage } from '@/ts/page/pageManager';

export default {
  name: 'SprintPage',
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
