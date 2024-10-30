<template>
  <h1>Ranked Page</h1>
</template>

<script lang="ts">
import { PAGE } from '@/ts/_enum/page';
import { setPage } from '@/ts/page/pageManager';

export default {
  name: 'RankedPage',
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
