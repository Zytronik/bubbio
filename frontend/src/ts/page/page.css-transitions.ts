import { nextTick } from "vue";
import { disableBackInputs, disableResetInput, enableBackInputs } from "../input/input.input-manager";

export async function transitionEndScreenPageToRankedDashboard(dashboardSelector: string, endScreenSelector: string, onStart?: () => void, onEnd?: () => void) {
    if (onStart) {
        onStart();
    }
    await nextTick(); // if i dont do this, dashboard is undefined
    const dashboard = document.querySelector(dashboardSelector) as HTMLElement;
    const resultScreen = document.querySelector(endScreenSelector) as HTMLElement;
    const container = document.querySelector('.page-container') as HTMLElement;
    container.classList.add('flex-row'); //add flex-row to container
    dashboard.classList.add('positionAbsolute'); //position dashboard to the left
    resultScreen.classList.add('slideToRight'); //slide result screen to the left
    dashboard.classList.add('slideLeftToCenter'); //slide dashboard to the left
    setTimeout(() => {
        if (onEnd) {
            onEnd();
        }
        resultScreen.classList.remove('slideToRight'); //reset styles
        dashboard.classList.remove('positionAbsolute'); //reset styles
        dashboard.classList.remove('slideLeftToCenter'); //reset styles
        container.classList.remove('flex-row') //remove flex-row from container
    }, 500);
}

export async function transitionEndScreenPageToDashboard(dashboardSelector: string, endScreenSelector: string, onStart?: () => void, onEnd?: () => void) {
    if (onStart) {
        onStart();
    }
    await nextTick(); // if i dont do this, dashboard is undefined
    const dashboard = document.querySelector(dashboardSelector) as HTMLElement;
    const resultScreen = document.querySelector(endScreenSelector) as HTMLElement;
    const content = document.querySelector('.page-dashboard .content') as HTMLElement;
    const playWrapper = document.querySelector('.page-dashboard .play-wrapper') as HTMLElement;
    const contentTitle = document.querySelector('.page-dashboard .content-title') as HTMLElement;
    dashboard.classList.add('positionAbsolute'); //position dashboard to the left

    const contentLeft = window.getComputedStyle(content,null).getPropertyValue("left");
    const playWrapperLeft = window.getComputedStyle(playWrapper,null).getPropertyValue("left");
    const contentTitleLeft = window.getComputedStyle(contentTitle,null).getPropertyValue("left");

    content.classList.add('moveFixedLeftOutOfScreen');
    playWrapper.classList.add('moveFixedLeftOutOfScreen');
    contentTitle.classList.add('moveFixedLeftOutOfScreen');

    resultScreen.classList.add('slideToRight'); //slide result screen to the left

    setTimeout(() => {
        content.classList.add('addTransitionToFixedElements');
        playWrapper.classList.add('addTransitionToFixedElements');
        contentTitle.classList.add('addTransitionToFixedElements');
        content.style.left = contentLeft;
        playWrapper.style.left = playWrapperLeft;
        contentTitle.style.left = contentTitleLeft;
    }, 1);
    
    setTimeout(() => {
        if (onEnd) {
            onEnd();
        }

        content.classList.remove('moveFixedLeftOutOfScreen');
        playWrapper.classList.remove('moveFixedLeftOutOfScreen');
        contentTitle.classList.remove('moveFixedLeftOutOfScreen');

        content.classList.remove('addTransitionToFixedElements');
        playWrapper.classList.remove('addTransitionToFixedElements');
        contentTitle.classList.remove('addTransitionToFixedElements');

        content.style.removeProperty('left');
        playWrapper.style.removeProperty('left');
        contentTitle.style.removeProperty('left');
        
        resultScreen.classList.remove('slideToRight'); //reset styles
        dashboard.classList.remove('positionAbsolute'); //reset styles
    }, 501);
}

export async function transitionDashboardToResultView(dashboardSelector: string, endScreenSelector: string, onStart?: () => void, onEnd?: () => void){
    if (onStart) {
        onStart();
    }
    await nextTick(); // if i dont do this, dashboard is undefined
    const dashboard = document.querySelector(dashboardSelector) as HTMLElement;
    const resultScreen = document.querySelector(endScreenSelector) as HTMLElement;
    const content = document.querySelector('.page-dashboard .content') as HTMLElement;
    const playWrapper = document.querySelector('.page-dashboard .play-wrapper') as HTMLElement;
    const contentTitle = document.querySelector('.page-dashboard .content-title') as HTMLElement;
    
    dashboard.classList.add('positionAbsolute');
    resultScreen.classList.add('positionRight');

    content.classList.add('addTransitionToFixedElements');
    playWrapper.classList.add('addTransitionToFixedElements');
    contentTitle.classList.add('addTransitionToFixedElements');

    content.style.left = "-100%";
    playWrapper.style.left = "-100%";
    contentTitle.style.left = "-100%";

    resultScreen.classList.add('slideRightToCenter');

    setTimeout(() => {
        if (onEnd) {
            onEnd();
        }

        resultScreen.classList.remove('positionRight');

        content.classList.remove('addTransitionToFixedElements');
        playWrapper.classList.remove('addTransitionToFixedElements');
        contentTitle.classList.remove('addTransitionToFixedElements');

        resultScreen.classList.remove('slideRightToCenter');
        dashboard.classList.remove('positionAbsolute');
    }, 501);
}

export function addGameViewStyles() {
    document.body.classList.add('game-view');

}
export function removeGameViewStyles() {
    document.body.classList.remove('game-view');
}

export function transitionToGame(onEnd: () => void, onHidden?: () => void): void {
    disableBackInputs();
    disableResetInput();
    document.body.classList.add('slide-out-left-to-game');
    const overlay = document.createElement('div');
    overlay.className = 'black-overlay-right';
    document.body.appendChild(overlay);
    setTimeout(() => {
        enableBackInputs();
        overlay.classList.add('black-overlay-cover');
        overlay.classList.remove('black-overlay-right');
        document.body.classList.remove('slide-out-left-to-game');
        addGameViewStyles();
        if (onHidden) {
            onHidden();
        }
        setTimeout(() => {
            document.body.removeChild(overlay);
            onEnd();
        }, 1000);
    }, 500);
}

export function transitionOutOfGame(isQuit: boolean, onStart?: ()=>void, onHidden?: () => void, onEnd?:()=>void): void {
    if(onStart){
        onStart();
    }
    const isQuitDelay = isQuit ? 0 : 1500;
    setTimeout(() => {
        document.body.classList.add('slide-out-right-off-game');
        const overlay = document.createElement('div');
        overlay.className = 'black-overlay-left';
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.classList.add('black-overlay-cover');
            if(onHidden){
                onHidden();
            }
            overlay.classList.remove('black-overlay-left');
            document.body.classList.remove('slide-out-right-off-game');
            removeGameViewStyles();
            setTimeout(() => {
                if(onEnd){
                    onEnd();
                }
                document.body.removeChild(overlay);
            }, 1000);
        }, 500);
    }, isQuitDelay);
}