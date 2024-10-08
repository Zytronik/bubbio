import { useSocketStore } from '@/stores/socketStore';

export async function waitForLoadingScreen() {
  const socketStore = useSocketStore();

  try {
    await Promise.all([socketStore.initSocket()]);
  } catch (error) {
    console.error('Error during preloading:', error);
  }
}
