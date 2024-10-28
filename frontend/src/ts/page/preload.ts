import { useInputStore } from '@/stores/inputStore';
import { usePixiStore } from '@/stores/pixiStore';
import { useSocketStore } from '@/stores/socketStore';
import { useSoundStore } from '@/stores/soundStore';

export async function waitForLoadingScreen() {
  const socketStore = useSocketStore();
  const soundStore = useSoundStore();
  const pixiStore = usePixiStore();
  const inputStore = useInputStore();
  const CANVAS_ID = "#pixiCanvas";

  try {
    await Promise.all([
      socketStore.initSocket(), 
      soundStore.preloadSounds(), 
      pixiStore.initPixiApp(),
      inputStore.setupInputReader(),
    ]);
    document.querySelector(CANVAS_ID)?.appendChild(pixiStore.getPixiApp().canvas);
  } catch (error) {
    console.error('Error during preloading:', error);
  }
}
