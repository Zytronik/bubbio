import { Howl, Howler } from 'howler';

const audioFiles: Record<string, { path: string; volume: number }> = {
    menu_back: { path: '/sounds/menu_back.wav', volume: 0.3 },
    menu_front: { path: '/sounds/menu_front.wav', volume: 0.3 },
    menu_hover: { path: '/sounds/menu_hover.wav', volume: 0.1 },
    button_play: { path: '/sounds/button_play.wav', volume: 0.3 },
};

Howler.volume(0.8); // Change global volume.
Howler.autoUnlock = true;

export const sounds: Record<string, Howl> = {};

export function playSound(sound: string) {
    if (sounds[sound]) {
        sounds[sound].play();
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
            const { path, volume } = audioFiles[key];
            const sound = new Howl({
                src: [path],
                volume: volume,
                onload: onLoad,
                onloaderror: (id, error) => {
                    reject(`Error loading file: ${path} - ${error}`);
                },
            });
            sounds[key] = sound;
        });
    });
}