import { useSocketStore } from '@/stores/socketStore';
import { useSoundStore } from '@/stores/soundStore';

export async function waitForLoadingScreen() {
  const socketStore = useSocketStore();
  const soundStore = useSoundStore();

  try {
    await Promise.all([socketStore.initSocket(), soundStore.preloadSounds()]);
  } catch (error) {
    console.error('Error during preloading:', error);
  }
}
