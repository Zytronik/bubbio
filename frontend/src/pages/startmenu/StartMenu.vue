<template>
  <section id="startmenu" class="page">
    <h1>StartMenu</h1>
    <button @click="setCurrentPage('Config')">Go to Config Page</button>
    <button @click="setCurrentPage('RoomListing')">Go to RoomListing</button>
    <button @click="setCurrentPage('Me')">Go to My Page</button>
  </section>
</template>

<script lang="ts">
import { PropType, onMounted } from 'vue';

export default {
  name: 'StartMenu',
  props: {
    setCurrentPage: {
      type: Function as PropType<(pageName: string) => void>,
      required: true
    }
  },
  setup() {
    onMounted(() => {
      console.log('Vue app mounted | MainMenu');
    });
  }
};
</script>

