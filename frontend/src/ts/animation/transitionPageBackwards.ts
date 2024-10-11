import { PAGE } from '../_constant/pages';
import { setPage } from '../page/pageManager';
import { AnimationSequence } from './animationSequence';
import { AnimationConfig } from '../_interface/animationConfig';

export function transitionPageBackwardsAnimation(transitionToPage: PAGE) {
    const animations: AnimationConfig[] = [
        {
            selector: '.sidebar',
            className: 'transitionPageBackwards-sideBar-slideOutToLeft',
            duration: 400,
        },
        {
            selector: '.sidebar',
            addProperty: true,
            propertyName: 'margin-left',
            value: '-200px',
        },
        {
            selector: '.pageContainer',
            className: 'transitionPageBackwards-pageContainer-slideOutFromLeft',
            duration: 150,
            onEnd: () => {
                setPage(transitionToPage);
            },
        },
        {
            selector: '.pageContainer',
            className: 'transitionPageBackwards-pageContainer-slideInFromLeft',
            duration: 150,
        },
    ];

    const animationSequence = new AnimationSequence(animations);
    animationSequence.play();
}
