import type { UserSession } from '@/ts/_interface/userDetails';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userSession: {
      clientId: '',
      currentPage: '',
      username: '',
      role: null,
      isRanked: false,
      userDetails: null,
    } as UserSession,
  }),
  actions: {
    setUser(newSession: UserSession) {
      this.userSession = {
        ...this.userSession,
        ...newSession,
        currentPage: this.userSession.currentPage || newSession.currentPage,
      };
    },
    updateCurrentPage(page: string) {
      this.userSession.currentPage = page;
    },
    clearUser() {
      this.userSession = {
        clientId: '',
        currentPage: '',
        username: '',
        role: null,
        isRanked: false,
        userDetails: null,
      };
    },
  },
});
