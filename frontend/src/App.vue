<template>
  <AppHeader />
  <main>
    <LoadingScreen :is-loading="pageIsLoading" />
    <ToastMessages />
    <PatchNotes />
    <CommunityOverlay v-if="showCommunity" />
    <LoginOverlay v-if="showLogin" />
    <article class="pageWrapper">
      <AppSidebar :back-buttons="currentBackButtons" :background-color="currentPageColor" />
      <section class="pageContainer" :class="currentPageName" v-if="currentComponent">
        <component :is="currentComponent" :key="currentPage" />
      </section>
    </article>
    <PixiCanvas />
  </main>
  <AppFooter />
</template>

<script lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePageStore } from '@/stores/pageStore';
import { pages } from './ts/_constant/pages';
import AppHeader from './components/AppHeader.vue';
import { checkUserAuthentication, logUserOut } from './ts/network/auth';
import LoginOverlay from './components/LoginOverlay.vue';
import ToastMessages from './components/ToastMessages.vue';
import { useSocketStore } from './stores/socketStore';
import LoadingScreen from './components/LoadingOverlay.vue';
import { waitForLoadingScreen } from './ts/page/preload';
import AppFooter from './components/AppFooter.vue';
import AppSidebar from './components/AppSidebar.vue';
import { initPageTransitionWatcher } from './ts/page/pageManager';
import PatchNotes from './components/PatchNotes.vue';
import { useSoundStore } from './stores/soundStore';
import CommunityOverlay from './components/CommunityOverlay.vue';
import PixiCanvas from './components/PixiCanvas.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    PixiCanvas,
    AppSidebar,
    LoginOverlay,
    ToastMessages,
    LoadingScreen,
    PatchNotes,
    CommunityOverlay,
  },
  setup() {
    const pageStore = usePageStore();
    const currentPage = storeToRefs(pageStore);
    const currentComponent = computed(() => pages[pageStore.currentPage].component);
    const currentPageName = computed(() => pageStore.currentPage);
    const currentBackButtons = computed(() => pages[pageStore.currentPage].backButtons);
    const currentPageColor = computed(() => pages[pageStore.currentPage].color);
    const showLogin = computed(() => !pageStore.isLoggedIn);
    const socketStore = useSocketStore();
    const pageIsLoading = ref(true);
    const showCommunity = computed(() => pageStore.showCommunity);

    initPageTransitionWatcher();
    checkUserAuthentication();

    const soundStore = useSoundStore();

    onMounted(async () => {
      await waitForLoadingScreen();
      pageIsLoading.value = false;
      soundStore.playMusic("menu_soundtrack");
    });

    onUnmounted(() => {
      socketStore.disconnectSocket();
    });

    return {
      currentComponent,
      currentBackButtons,
      currentPageName,
      currentPageColor,
      currentPage,
      showLogin,
      logUserOut,
      pageIsLoading,
      showCommunity,
    };
  },
};
</script>

<style scoped></style>
