<template>
  <div class="loading-screen" v-show="isLoading">
    <div class="loading-content">
      <p>Loading, please wait brudi...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingScreen',
  props: {
    isLoading: {
      type: Boolean,
      required: true
    }
  }
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 1);
  z-index: 1000;
  font-size: var(--font-size-5);
}

.loading-content {
  text-align: center;
}
</style>
