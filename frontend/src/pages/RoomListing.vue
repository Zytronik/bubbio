<template>
  <h1>Room Listing</h1>
</template>

<script lang="ts">
import { PAGE } from '@/ts/_enum/page';
import { setPage } from '@/ts/page/pageManager';

export default {
  name: 'RoomListing',
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
