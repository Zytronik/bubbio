import type { UserDetails, UserSession } from '@/ts/_interface/userDetails';
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
    updateUserDetails(userDetails: UserDetails) {
      this.userSession.userDetails = userDetails;
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
    isGuest() {
      return this.userSession.role === 'guest';
    },
    isUser() {
      return this.userSession.role === 'user';
    },
  },
});
