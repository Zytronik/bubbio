<template>
  <AppHeader />
  <main>
    <LoadingScreen :is-loading="pageIsLoading" />
    <ToastMessages />
    <PatchNotes />
    <LoginOverlay v-if="showLogin" />
    <article class="pageWrapper">
      <AppSidebar :back-buttons="currentBackButtons" :background-color="currentPageColor" />
      <section class="pageContainer" :class="currentPageName" v-if="currentComponent">
        <component :is="currentComponent" :key="currentPage" />
      </section>
    </article>
    <!-- <div>
      <div>
        <p>Client ID: {{ userSession.clientId }}</p>
        <p>Current Page: {{ userSession.currentPage }}</p>
        <p>Username: {{ userSession.username }}</p>
        <p>Role: {{ userSession.role }}</p>
        <div v-if="userSession.userDetails">
          <p>User ID: {{ userSession.userDetails.id }}</p>
          <p>Email: {{ userSession.userDetails.email }}</p>
          <p>Is Ranked: {{ userSession.isRanked }}</p>
          <p>Percentile: {{ userSession.userDetails.percentile }}</p>
          <p>Rank: {{ userSession.userDetails.rank.name }}</p>
          <p>Global Rank: {{ userSession.userDetails.globalRank }}</p>
          <p>Probably Around: {{ userSession.userDetails.probablyAroundRank.name }}</p>
        </div>
      </div>
      <button @click="logUserOut">Logout</button>
    </div> -->
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
import { useUserStore } from './stores/userStore';
import LoadingScreen from './components/LoadingScreen.vue';
import { waitForLoadingScreen } from './ts/page/preload';
import AppFooter from './components/AppFooter.vue';
import AppSidebar from './components/AppSidebar.vue';
import { initPageTransitionWatcher } from './ts/page/pageManager';
import PatchNotes from './components/PatchNotes.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    AppSidebar,
    LoginOverlay,
    ToastMessages,
    LoadingScreen,
    PatchNotes,
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

    //temp --------
    const userStore = useUserStore();
    const userSession = computed(() => userStore.userSession);
    //temp --------

    initPageTransitionWatcher();
    checkUserAuthentication();

    onMounted(async () => {
      await waitForLoadingScreen();
      pageIsLoading.value = false;
      //do stuff after this---------
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
      userSession,
      logUserOut,
      pageIsLoading,
    };
  },
};
</script>

<style scoped></style>
