import { Howl } from 'howler';

export interface Sound {
  path: string;
  volume: number;
  type: 'sfx' | 'music';
  howl?: Howl;
}
