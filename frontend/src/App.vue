<template>
  <article id="app">
    <button v-for="(page, index) in pages" :key="index" @click="setCurrentComponent(index)">
      {{ page.name }}
    </button>
    <component :is="currentComponent"></component>
  </article>
</template>

<script lang="ts">
import { ref, computed, watchEffect, Ref } from 'vue';
import { Page } from './interfaces/interfaces.page';
import homePage from './pages/home/Home.vue';
import gamePage from './pages/game/Game.vue';

export default {
  name: 'App',
  setup() {
    const pages: Page[] = [
      { name: 'Home', component: homePage },
      { name: 'Game', component: gamePage },
    ];

    const currentComponentIndex: Ref<number> = ref(0);

    function setCurrentComponent(index: number) {
      currentComponentIndex.value = index;
    }

    const currentComponent = computed(() => pages[currentComponentIndex.value].component);

    watchEffect(() => {
      // Update document title with the original HTML title and the name of the current page
      document.title = `${document.title.split('|')[0]} | ${pages[currentComponentIndex.value].name}`;
    });

    return {
      pages, 
      setCurrentComponent, 
      currentComponent
    };
  },
}


</script>

