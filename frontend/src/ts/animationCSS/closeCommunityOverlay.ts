import { AnimationSequence } from './animationSequence';
import { AnimationConfig } from '../_interface/cssAnimationConfig';
import { useSoundStore } from '@/stores/soundStore';
import { usePageStore } from '@/stores/pageStore';

export function closeCommunityOverlay() {
  useSoundStore().playSound('menu_back');

  const animations: AnimationConfig[] = [
    {
      selector: '.community',
      className: 'closeCommunityOverlay-community-slideToBottom',
      duration: 150,
      onEnd: () => {
        usePageStore().hideCommunityOverlay();
      },
    },
  ];

  const animationSequence = new AnimationSequence(animations);
  animationSequence.play();
}
