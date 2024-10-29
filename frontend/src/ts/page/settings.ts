import { useSoundStore } from '@/stores/soundStore';
import { Settings } from '../_interface/settings';
import { allInputs } from '../input/allInputs';
import { useUserStore } from '@/stores/userStore';
import { httpClient } from '../network/httpClient';

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
    httpClient.post('users/settings/save', settings);
  }
}

export async function loadSettings() {
  const soundStore = useSoundStore();
  const userStore = useUserStore();
  let settings: Settings | null = null;

  if (userStore.isGuest()) {
    const settingsString = localStorage.getItem('settings');
    if (settingsString) {
      settings = JSON.parse(settingsString);
    }
  }

  if (userStore.isUser()) {
    const response = await httpClient.get('users/settings/save');
    settings = response.data;
  }

  if (settings) {
    soundStore.setMusicVolume(settings.audio.musicVolume);
    soundStore.setSfxVolume(settings.audio.sfxVolume);

    settings.inputs.forEach(inputSetting => {
      const input = allInputs.find(input => input.name === inputSetting.name);
      if (input && inputSetting.customKeyMap) {
        input.customKeyMap = inputSetting.customKeyMap;
      }
    });
  }
}
