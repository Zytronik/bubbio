import { usePageStore } from '@/stores/pageStore';
import { pages, PAGE } from '@/ts/_constant/pages';
import { watchEffect } from 'vue';
import { checkUserAuthentication } from '../network/auth';
import { useSocketStore } from '@/stores/socketStore';

export function canTransitionTo(newPage: PAGE): boolean {
  const pageStore = usePageStore();
  const currentPage = pageStore.currentPage;
  const allowedTransitions = pages[currentPage].allowedTransitions;
  return allowedTransitions.includes(newPage);
}

export function setPage(newPage: PAGE) {
  if (checkUserAuthentication()) {
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
  document.title = `${document.title.split('|')[0]} | ${pages[currentPage].title}`;
}
