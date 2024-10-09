import { PAGE } from '../_constant/pages';
import { setPage } from '../page/pageManager';
import { AnimationSequence } from './animationSequence';
import { AnimationConfig } from '../_interface/animationConfig';
import { nextTick } from 'vue';

export function transitionPageAnimation(transitionToPage: PAGE) {
    const animations: AnimationConfig[] = [
        {
            selector: '.pageContainer',
            className: 'transitionPage-pageContainer-slideOutFromRight',
            duration: 150,
            onEnd: async () => {
                setPage(transitionToPage);
                await nextTick();
                const sideBar = document.querySelector(
                    '.sidebar',
                ) as HTMLElement;
                sideBar.style.marginLeft = '-100px';
            },
        },
        {
            selector: '.sidebar',
            addProperty: true,
            propertyName: 'margin-left',
            value: '-100px',
        },
        {
            selector: '.pageContainer',
            className: 'transitionPage-pageContainer-slideInFromRight',
            duration: 150,
        },
        {
            selector: '.sidebar',
            className: 'transitionPage-sideBar-slideInFromLeft',
            duration: 400,
        },
        {
            selector: '.sidebar',
            removeProperty: true,
            propertyName: 'margin-left',
        },
    ];

    const animationSequence = new AnimationSequence(animations);
    animationSequence.play();

    /* setTimeout(() => {
        animationSequence.abort();
    }, 400); */
}
