import {
  soundData,
} from '@/ts/sound/allSounds';
import { Sound } from '@/ts/_interface/sound';
import { defineStore } from 'pinia';
import { Howl } from 'howler';

export const useSoundStore = defineStore('soundStore', {
  state: () => ({
    sounds: {} as Record<string, Sound>,
    currentMusic: null as Howl | null,
    currentMusicKey: '' as string,
    defaultSfxVolume: 0.5,
    defaultMusicVolume: 0.5,
    sfxVolume: 0.5,
    musicVolume: 0.5,
  }),
  actions: {
    preloadSounds() {
      for (const [key, sound] of Object.entries(soundData)) {
        const isMusic = sound.type === 'music';
        this.sounds[key] = {
          ...sound,
          howl: new Howl({
            src: [sound.path],
            volume: isMusic
              ? this.musicVolume * sound.volume
              : this.sfxVolume * sound.volume,
            loop: isMusic,
          }),
        };
      }
    },
    playSound(key: string) {
      const sound = this.sounds[key];
      if (sound && sound.howl) {
        sound.howl.volume(
          sound.type === 'music'
            ? this.musicVolume * sound.volume
            : this.sfxVolume * sound.volume,
        );
        sound.howl.play();
      }
    },
    playMusic(key: string) {
      const sound = this.sounds[key];
      if (sound && sound.howl && sound.type === 'music') {
        if (this.currentMusic) {
          this.currentMusic.stop();
        }
        this.currentMusic = sound.howl;
        this.currentMusicKey = key;
        this.currentMusic.volume(this.musicVolume * sound.volume);
        this.currentMusic.play();
      }
    },
    setSfxVolume(volume: number) {
      this.sfxVolume = volume;
      for (const sound of Object.values(this.sounds)) {
        if (sound.type === 'sfx' && sound.howl) {
          sound.howl.volume(this.sfxVolume * sound.volume);
        }
      }
    },
    setMusicVolume(volume: number) {
      this.musicVolume = volume;
      if (this.currentMusic && this.currentMusicKey) {
        const currentSound = this.sounds[this.currentMusicKey];
        if (currentSound) {
          this.currentMusic.volume(this.musicVolume * currentSound.volume);
        }
      }
    },
    resetSfxVolume() {
      this.setSfxVolume(this.defaultSfxVolume);
    },
    resetMusicVolume() {
      this.setMusicVolume(this.defaultMusicVolume);
    },
  },
});
