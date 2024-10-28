import { PAGE } from '@/ts/_enum/page';
import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', {
  state: () => ({
    currentPage: PAGE.startMenu,
    isLoggedIn: false,
    showCommunity: false,
  }),
  actions: {
    setPage(page: PAGE) {
      this.currentPage = page;
    },
    setLoginStatus(isLoggedIn: boolean) {
      this.isLoggedIn = isLoggedIn;
    },
    showCommunityOverlay() {
      this.showCommunity = true;
    },
    hideCommunityOverlay() {
      this.showCommunity = false;
    },
  },
});
