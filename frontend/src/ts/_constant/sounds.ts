import { Sound } from '../_interface/sound';

export const defaultSfxVolume = 0.5;
export const defaultMusicVolume = 0.5;

export const soundData: Record<string, Sound> = {
  menu_back: {
    path: require('@/assets/sounds/menu_back.wav'),
    volume: 0.3,
    type: 'sfx',
  },
  menu_front: {
    path: require('@/assets/sounds/menu_front.wav'),
    volume: 0.3,
    type: 'sfx',
  },
  menu_hover: {
    path: require('@/assets/sounds/menu_hover.wav'),
    volume: 0.05,
    type: 'sfx',
  },
  button_play: {
    path: require('@/assets/sounds/button_play.wav'),
    volume: 0.3,
    type: 'sfx',
  },
  menu_soundtrack: {
    path: require('@/assets/sounds/menu_soundtrack.mp3'),
    volume: 0.3,
    type: 'music',
  },
  game_soundtrack: {
    path: require('@/assets/sounds/game_soundtrack.mp3'),
    volume: 0.3,
    type: 'music',
  },
  shoot: {
    path: require('@/assets/sounds/shoot.mp3'),
    volume: 0.3,
    type: 'sfx',
  },
  clear: {
    path: require('@/assets/sounds/clear.mp3'),
    volume: 0.5,
    type: 'sfx',
  },
  hold: { path: require('@/assets/sounds/hold.mp3'), volume: 0.1, type: 'sfx' },
  wallBounce: {
    path: require('@/assets/sounds/wallBounce.mp3'),
    volume: 0.3,
    type: 'sfx',
  },
  spike: {
    path: require('@/assets/sounds/spike.mp3'),
    volume: 0.3,
    type: 'sfx',
  },
  incomingGarbage: {
    path: require('@/assets/sounds/incomingGarbage.mp3'),
    volume: 0.3,
    type: 'sfx',
  },
  countDown3: {
    path: require('@/assets/sounds/countDown3.mp3'),
    volume: 2,
    type: 'sfx',
  },
  countDown2: {
    path: require('@/assets/sounds/countDown2.mp3'),
    volume: 2,
    type: 'sfx',
  },
  countDown1: {
    path: require('@/assets/sounds/countDown1.mp3'),
    volume: 2,
    type: 'sfx',
  },
  countDownGo: {
    path: require('@/assets/sounds/countDownGo.mp3'),
    volume: 2,
    type: 'sfx',
  },
  win: { path: require('@/assets/sounds/win.wav'), volume: 0.3, type: 'sfx' },
  lose: { path: require('@/assets/sounds/lose.wav'), volume: 0.3, type: 'sfx' },
  perfectClear: {
    path: require('@/assets/sounds/allClear.mp3'),
    volume: 0.3,
    type: 'sfx',
  },
};
