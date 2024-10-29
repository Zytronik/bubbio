import { useSoundStore } from '@/stores/soundStore';
import { Settings } from '../_interface/settings';
import { allInputs } from '../input/allInputs';
import { useUserStore } from '@/stores/userStore';

export function saveSettings() {
  const soundStore = useSoundStore();
  const userStore = useUserStore();
  const settings: Settings = {
    inputs: allInputs,
    handlings: null,
    graphics: null,
    audio: {
      musicVolume: soundStore.musicVolume,
      sfxVolume: soundStore.sfxVolume,
    },
  };

  if (userStore.isGuest()) {
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  if (userStore.isUser()) {
    //TODO
  }
}

export function loadSettings() {
  const soundStore = useSoundStore();
  const userStore = useUserStore();

  if (userStore.isGuest()) {
    const settings = localStorage.getItem('settings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      soundStore.setMusicVolume(parsedSettings.audio.musicVolume);
      soundStore.setSfxVolume(parsedSettings.audio.sfxVolume);
      allInputs.forEach(input => {
        //TODO
      });
    }
  }

  if (userStore.isUser()) {
    //TODO
  }
}
