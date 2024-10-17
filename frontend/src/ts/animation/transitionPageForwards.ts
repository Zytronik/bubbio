import { PAGE } from '../_constant/pages';
import { setPage } from '../page/pageManager';
import { AnimationSequence } from './animationSequence';
import { AnimationConfig } from '../_interface/animationConfig';
import { useSoundStore } from '@/stores/soundStore';

export function transitionPageForwardsAnimation(transitionToPage: PAGE) {
  useSoundStore().playSound('menu_front');
  const animations: AnimationConfig[] = [
    {
      selector: '.pageWrapper',
      className: 'transitionPageForwards-pageWrapper-slideOutFromRight',
      duration: 150,
      onEnd: () => {
        setPage(transitionToPage);
      },
    },
    {
      selector: '.sidebar',
      addProperty: true,
      propertyName: 'margin-left',
      value: '-150px',
    },
    {
      selector: '.pageContainer',
      className: 'transitionPageForwards-pageContainer-slideInFromRight',
      duration: 150,
    },
    {
      selector: '.sidebar',
      className: 'transitionPageForwards-sideBar-slideInFromLeft',
      duration: 400,
    },
    {
      selector: '.sidebar',
      addProperty: true,
      propertyName: 'margin-left',
      value: '0px',
    },
  ];

  const animationSequence = new AnimationSequence(animations);
  animationSequence.play();
}
