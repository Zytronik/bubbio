import { nextTick } from "vue";
import { disableBackInputs, disableResetInput, enableBackInputs } from "../input/input.input-manager";

export async function transitionEndScreenPageToDashboard(dashboardSelector: string, endScreenSelector: string, onStart?: () => void, onEnd?: () => void) {
    if (onStart) {
        onStart();
    }
    await nextTick(); // if i dont do this, dashboard is undefined
    const dashboard = document.querySelector(dashboardSelector) as HTMLElement;
    const resultScreen = document.querySelector(endScreenSelector) as HTMLElement;
    const container = document.querySelector('.page-container') as HTMLElement;
    container.classList.add('flex-row'); //add flex-row to container
    dashboard.classList.add('moveResultScreen-left'); //position dashboard to the left
    resultScreen.classList.add('slideToRight'); //slide result screen to the left
    dashboard.classList.add('slideLeftToCenter'); //slide dashboard to the left
    setTimeout(() => {
        if (onEnd) {
            onEnd();
        }
        resultScreen.classList.remove('slideToRight'); //reset styles
        dashboard.classList.remove('moveResultScreen-left'); //reset styles
        dashboard.classList.remove('slideLeftToCenter'); //reset styles
        container.classList.remove('flex-row') //remove flex-row from container
    }, 500);
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
        document.body.classList.add('game-view');
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
            document.body.classList.remove('game-view');
            setTimeout(() => {
                if(onEnd){
                    onEnd();
                }
                document.body.removeChild(overlay);
            }, 1000);
        }, 500);
    }, isQuitDelay);
}