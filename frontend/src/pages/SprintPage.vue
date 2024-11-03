<template>
  <h1>Sprint</h1>
</template>

<script lang="ts">
import { PAGE } from '@/ts/_enum/page';
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
