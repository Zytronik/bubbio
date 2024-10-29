import { AudioSettings } from './audioSettings';
import { Input } from './input';

export interface Settings {
  inputs: Input[];
  handlings: String[] | null; //TODO
  graphics: String[] | null; //TODO
  audio: AudioSettings;
}
