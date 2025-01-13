import { usePageStore } from '@/stores/pageStore';
import { allPages } from '@/ts/page/allPages';
import { watchEffect } from 'vue';
import { checkUserAuthentication } from '../network/auth';
import { useSocketStore } from '@/stores/socketStore';
import { PAGE } from '../_enum/page';
import { useLobbyStore } from '@/stores/lobbyStore';

export function canTransitionTo(newPage: PAGE): boolean {
  const pageStore = usePageStore();
  const currentPage = pageStore.currentPage;
  const allowedTransitions = allPages[currentPage].allowedTransitions;
  return allowedTransitions.includes(newPage);
}

export function setPage(newPage: PAGE) {
  if (
    checkUserAuthentication() ||
    (!checkUserAuthentication() && newPage == PAGE.startMenu)
  ) {
    if (canTransitionTo(newPage)) {
      transitionPage(newPage);
    } else {
      console.error(
        `Transition to ${newPage} is not allowed from the current page.`,
      );
    }
  } else {
    redirectToLogin();
  }
}

function transitionPage(newPage: PAGE): void {
  const pageStore = usePageStore();
  pageStore.setPage(newPage);
  const socketStore = useSocketStore();
  socketStore.updateUserPage(newPage);
}

function redirectToLogin(): void {
  const pageStore = usePageStore();
  console.warn('User is not authenticated. Redirecting to login.');
  pageStore.setLoginStatus(false);
}

export function initPageTransitionWatcher() {
  watchEffect(() => {
    const pageStore = usePageStore();
    const { currentPage } = pageStore;
    updateDocumentTitle(currentPage);
  });
}

function updateDocumentTitle(currentPage: PAGE) {
  document.title = `${document.title.split('|')[0]} | ${allPages[currentPage].title}`;
}

export function checkIfCanJoinRoomByUrl() {
  const lobbyStore = useLobbyStore();
  const currentRoomId = window.location.hash.slice(1);
  if (currentRoomId) {
    lobbyStore.joinLobby(currentRoomId);
  }
}
