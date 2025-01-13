import { Howl, Howler } from 'howler';
import { ref } from 'vue';
import { NumberSetting } from '../game/settings/ref/i/game.settings.ref.i.number-setting';

const audioFiles: Record<string, { path: string; volume: number; type: 'music' | 'sfx' }> = {
    menu_back: { path: '/sounds/menu_back.wav', volume: 0.3, type: 'sfx' },
    menu_front: { path: '/sounds/menu_front.wav', volume: 0.3, type: 'sfx' },
    menu_hover: { path: '/sounds/menu_hover.wav', volume: 0.05, type: 'sfx' },
    button_play: { path: '/sounds/button_play.wav', volume: 0.3, type: 'sfx' },
    menu_soundtrack: { path: '/sounds/menu_soundtrack.mp3', volume: 0.3, type: 'music' },
    game_soundtrack: { path: '/sounds/game_soundtrack.mp3', volume: 0.3, type: 'music' },
    shoot: { path: '/sounds/shoot.mp3', volume: 0.3, type: 'sfx' },
    clear: { path: '/sounds/clear.mp3', volume: 0.5, type: 'sfx' },
    hold: { path: '/sounds/hold.mp3', volume: 0.1, type: 'sfx' },
    wallBounce: { path: '/sounds/wallBounce.mp3', volume: 0.3, type: 'sfx' },
    spike: { path: '/sounds/spike.mp3', volume: 0.3, type: 'sfx' },
    incomingGarbage: { path: '/sounds/incomingGarbage.mp3', volume: 0.3, type: 'sfx' },
    countDown3: { path: '/sounds/countDown3.mp3', volume: 2, type: 'sfx' },
    countDown2: { path: '/sounds/countDown2.mp3', volume: 2, type: 'sfx' },
    countDown1: { path: '/sounds/countDown1.mp3', volume: 2, type: 'sfx' },
    countDownGo: { path: '/sounds/countDownGo.mp3', volume: 2, type: 'sfx' },
    win: { path: '/sounds/win.wav', volume: 0.3, type: 'sfx' },
    lose: { path: '/sounds/lose.wav', volume: 0.3, type: 'sfx' },
    perfectClear: { path: '/sounds/allClear.mp3', volume: 0.3, type: 'sfx' },
}

export const MUSIC_VOLUME: NumberSetting = {
    name: "Music Volume",
    description: "The volume of the music in the game",
    refNumber: ref(0.8),
    defaultValue: 0.8,
    min: 0,
    max: 1,
}

export const SFX_VOLUME: NumberSetting = {
    name: "SFX Volume",
    description: "The volume of the sound effects in the game",
    refNumber: ref(0.8),
    defaultValue: 0.8,
    min: 0,
    max: 1,
}

Howler.autoUnlock = true;

export const sounds: Record<string, Howl> = {};

export function playSound(sound: string) {
    if (sounds[sound]) {
        sounds[sound].play();
    }
}

export function stopSoundtrack() {
    const soundtrackPlaying = localStorage.getItem('soundtrackPlaying');
    if (soundtrackPlaying) {
        sounds[soundtrackPlaying].stop();
        localStorage.removeItem('soundtrackPlaying');
    }
}

export function playSoundtrack(sound: string) {
    if (sounds[sound]) {
        const howl = sounds[sound];
        const soundtrackPlaying = localStorage.getItem('soundtrackPlaying');
        if (!howl.playing() && soundtrackPlaying !== sound) {
            howl.loop(true);
            howl.volume(0);
            howl.play();
            howl.fade(0, audioFiles[sound].volume * MUSIC_VOLUME.refNumber.value, 5000); // Fade in over 5 seconds
            localStorage.setItem('soundtrackPlaying', sound);
        }
    }
}

export function loadAudioFiles() {
    return new Promise((resolve, reject) => {
        let loadedCount = 0;
        const totalFiles = Object.keys(audioFiles).length;

        const onLoad = () => {
            loadedCount++;
            if (loadedCount === totalFiles) {
                resolve(sounds);
            }
        };

        Object.keys(audioFiles).forEach((key) => {
            const { path, volume, type } = audioFiles[key];
            const sound = new Howl({
                src: [path],
                volume: type === 'music' ? volume * MUSIC_VOLUME.refNumber.value : volume * SFX_VOLUME.refNumber.value,
                onload: onLoad,
                onloaderror: (id, error) => {
                    reject(`Error loading file: ${path} - ${error}`);
                },
            });
            sounds[key] = sound;
        });
    });
}

export function setMusicVolume(volume: number) {
    MUSIC_VOLUME.refNumber.value = volume;
    Object.keys(sounds).forEach((key) => {
        if (audioFiles[key].type === 'music') {
            sounds[key].volume(audioFiles[key].volume * MUSIC_VOLUME.refNumber.value);
        }
    });
}

export function setSfxVolume(volume: number) {
    SFX_VOLUME.refNumber.value = volume;
    Object.keys(sounds).forEach((key) => {
        if (audioFiles[key].type === 'sfx') {
            sounds[key].volume(audioFiles[key].volume * SFX_VOLUME.refNumber.value);
        }
    });
}

export function resetMusicVolume() {
    setMusicVolume(MUSIC_VOLUME.defaultValue);
}

export function resetSfxVolume() {
    setSfxVolume(SFX_VOLUME.defaultValue);
}