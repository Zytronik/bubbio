import { RankInfo } from '@/ts/_interface/rank';
import type { UserSession } from '@/ts/_interface/userSession';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userSession: getEmptyUserSession(),
  }),
  actions: {
    setUser(newSession: UserSession) {
      this.userSession = {
        ...this.userSession,
        ...newSession,
        currentPage: this.userSession.currentPage || newSession.currentPage,
      }
    },
    updateUserSession(userSession: UserSession) {
      this.userSession = userSession;
    },
    updateCurrentPage(page: string) {
      this.userSession.currentPage = page;
    },
    clearUser() {
      this.userSession = getEmptyUserSession();
    },
    isGuest() {
      return this.userSession.role === 'guest';
    },
    isUser() {
      return this.userSession.role === 'user';
    },
    getUserSession(): UserSession {
      return this.userSession;
    }
  }
});

function getEmptyRank(): RankInfo {
  return {
    ascii: "",
    name: "",
    iconName: "",
    percentile: 0
  }
}

function getEmptyUserSession(): UserSession {
  return {
    role: null,
    username: '',
    currentPage: '',
    clientId: '',
    isRanked: false,
    userId: 0,
    email: '',
    LastDisconnectedAt: new Date(),
    rating: 0,
    ratingDeviation: 0,
    volatility: 0,
    createdAt: new Date(),
    rank: getEmptyRank(),
    globalRank: 0,
    percentile: 0,
    probablyAroundRank: getEmptyRank()
  }
}