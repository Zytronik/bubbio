<template>
  <div id="app">
    <button v-for="(page, index) in pages" :key="index" @click="setCurrentComponent(index)">
      {{ page.name }}
    </button>
    <component :is="currentComponent"></component>
  </div>
</template>

<script lang="ts">
import { ref, computed, watchEffect, Ref } from 'vue';
import { Page } from './interfaces/interfaces.page';
import homePage from './pages/home/Home.vue';
import gamePage from './pages/game/Game.vue';
import { InputReader } from './settings/input/settings.input.input-reader';

export default {
  name: 'App',
  setup() {
    const pages: Page[] = [
      { name: 'Home', component: homePage },
      { name: 'Game', component: gamePage },
    ];
    const currentComponent = computed(() => pages[currentComponentIndex.value].component);
    const currentComponentIndex: Ref<number> = ref(0);
    watchEffect(() => {
      // Update document title with the original HTML title and the name of the current page
      document.title = `${document.title.split('|')[0]} | ${pages[currentComponentIndex.value].name}`;
    });
    function setCurrentComponent(index: number) {
      currentComponentIndex.value = index;
    }
    return {
      pages,
      setCurrentComponent,
      currentComponent
    };
  }
}
const inputReader = new InputReader();
</script>

