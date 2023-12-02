<template>
  <div id="app">
    <button v-for="(page, index) in pages" :key="index" @click="setCurrentComponent(index)">
      {{ page.name }}
    </button>
    <component :is="currentComponent"></component>
  </div>
</template>

<script setup>
import { ref,computed  } from 'vue';
import homePage from './pages/Home/home.vue';
import gamePage from './pages/Game/game.vue';

const pages = [
  { name: 'Home', component: homePage },
  { name: 'Game', component: gamePage },
];

const currentComponentIndex = ref(0);

function setCurrentComponent(index) {
  currentComponentIndex.value = index;
};

const currentComponent = computed(() => pages[currentComponentIndex.value].component);
</script>

<style>

</style>
