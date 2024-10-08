<template>
  <h1>Settings</h1>
  <button @click="setPage(PAGE.startMenu)">Home</button>
</template>

<script lang="ts">
import { PAGE } from '@/ts/_constant/pages';
import { setPage } from '@/ts/page/pageManager';

export default {
  name: 'SettingsPage',
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
