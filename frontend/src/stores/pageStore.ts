import { PAGE } from '@/ts/_constant/pages';
import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', {
  state: () => ({
    currentPage: PAGE.startMenu,
    isLoggedIn: false,
  }),
  actions: {
    setPage(page: PAGE) {
      this.currentPage = page;
    },
    setLoginStatus(isLoggedIn: boolean) {
      this.isLoggedIn = isLoggedIn;
    },
  },
});
