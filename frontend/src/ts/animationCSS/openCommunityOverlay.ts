import { AnimationSequence } from './animationSequence';
import { AnimationConfig } from '../_interface/cssAnimationConfig';
import { useSoundStore } from '@/stores/soundStore';
import { usePageStore } from '@/stores/pageStore';

export function openCommunityOverlay() {
  useSoundStore().playSound('menu_front');
  usePageStore().showCommunityOverlay();

  const animations: AnimationConfig[] = [
    {
      selector: '.community',
      className: 'openCommunityOverlay-community-slideInFromBottom',
      duration: 150,
    },
  ];

  setTimeout(() => {
    const animationSequence = new AnimationSequence(animations);
    animationSequence.play();
  }, 1);
}
