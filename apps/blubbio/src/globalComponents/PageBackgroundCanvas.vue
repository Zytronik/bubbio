<template>
  <div id="backgroundCanvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageBackgroundCanvas',
});
</script>

<style scoped>
#backgroundCanvas {
  position: fixed;
  top: 0;
  z-index: -1;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
