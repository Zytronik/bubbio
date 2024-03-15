import { checkUserAuthentication, logUserOut } from "../networking/networking.auth";
import { PAGE_STATE } from "./page.e-page-state";
import { mainMenuToSettingsPageTransition, allPossibleTransitions, gamePageToMainMenuTransition, gamePageToRoomPageTransition, mainMenuToMultiMenuTransition, roomListingToMultiMenuTransition, roomListingToRoomPageTransition, roomPageToRoomListingTransition, settingsPageToMainMenuTransition, roomPageToMultiMenuTransition, multiMenuToSoloMenuTransition, soloMenuToSprintPageTransition, spintPageToSoloMenuTransition, mainMenuToSoloMenuTransition, soloMenuToMainMenuTransition, multiMenuToRoomListingTransition, multiMenuToMainMenuTransition, soloMenuToMultiMenuTransition, soloMenuTosettingsPageTransition, multiMenuToSettingsPageTransition, settingsPageToMultiMenuTransition, settingsPageToSoloMenuTransition } from "./page.possible-transitions";
import { Page } from "./page.i-page";
import StartMenu from '../../pages/startmenu/StartMenu.vue';
import Room from '../../pages/room/Room.vue';
import Game from '../../pages/game/Game.vue';
import Sprint from '../../pages/sprint/Sprint.vue';
import Config from '../../pages/config/Config.vue';
import RoomListing from '../../pages/room-listing/RoomListing.vue';
import SoloMenu from '../../pages/solomenu/SoloMenu.vue';
import MultiMenu from '../../pages/multimenu/MultiMenu.vue';
import { ref } from 'vue';
import eventBus from "./page.event-bus";

export const pages: Page[] = [
    { title: 'StartMenu', pageState: PAGE_STATE.mainMenu, component: StartMenu },
    { title: 'SoloMenu', pageState: PAGE_STATE.soloMenu, component: SoloMenu },
    { title: 'MultiMenu', pageState: PAGE_STATE.multiMenu, component: MultiMenu },
    { title: 'RoomListing', pageState: PAGE_STATE.roomListing, component: RoomListing },
    { title: 'Room', pageState: PAGE_STATE.roomPage, component: Room },
    { title: 'Config', pageState: PAGE_STATE.settingsPage, component: Config },
    { title: 'Game', pageState: PAGE_STATE.gamePage, component: Game },
    { title: 'Sprint', pageState: PAGE_STATE.sprintPage, component: Sprint },

];

export function setupTransitionFunctions() {
    mainMenuToSettingsPageTransition.transitionFunction = mainMenuToSettingsPage;
    multiMenuToRoomListingTransition.transitionFunction = multiMenuToRoomListing;
    mainMenuToMultiMenuTransition.transitionFunction = mainMenuToMultiMenu;
    mainMenuToSoloMenuTransition.transitionFunction = mainMenuToSoloMenu;
    multiMenuToSoloMenuTransition.transitionFunction = multiMenuToSoloMenu;
    settingsPageToMainMenuTransition.transitionFunction = settingsPageToMainMenu;
    roomListingToMultiMenuTransition.transitionFunction = roomListingToMultiMenu;
    roomListingToRoomPageTransition.transitionFunction = roomListingToRoomPage;
    roomPageToRoomListingTransition.transitionFunction = roomPageToRoomListing;
    roomPageToMultiMenuTransition.transitionFunction = roomPageToMultiMenu;
    soloMenuToMainMenuTransition.transitionFunction = soloMenuToMainMenu;
    gamePageToMainMenuTransition.transitionFunction = gamePageToMainMenu;
    gamePageToRoomPageTransition.transitionFunction = gamePageToRoomPage;
    spintPageToSoloMenuTransition.transitionFunction = spintPageToSoloMenu;
    soloMenuToSprintPageTransition.transitionFunction = soloMenuToSprintPage;
    multiMenuToMainMenuTransition.transitionFunction = multiMenuToMainMenu;
    soloMenuToMultiMenuTransition.transitionFunction = soloMenuToMultiMenu;
    soloMenuTosettingsPageTransition.transitionFunction = soloMenuTosettingsPage;
    multiMenuToSettingsPageTransition.transitionFunction = multiMenuToSettingsPage;
    settingsPageToMultiMenuTransition.transitionFunction = settingsPageToMultiMenu;
    settingsPageToSoloMenuTransition.transitionFunction = settingsPageToSoloMenu;
}

export const currentPageState = ref<PAGE_STATE>(PAGE_STATE.mainMenu);

export function goToState(destination: PAGE_STATE, isNavigatingForward = true) {
    if (destination !== currentPageState.value) {
        const isLoggedIn = checkUserAuthentication();
        if (!isLoggedIn) {
            logUserOut();
            destination = PAGE_STATE.mainMenu;
        }
        const result = allPossibleTransitions.filter(transition =>
            transition.origin === currentPageState.value && transition.destination === destination
        );
        if (result.length > 0) {
            eventBus.setNavigationDirection(isNavigatingForward);
            let waitBeforeTransition = 0;
            if (!isNavigatingForward) {
                waitBeforeTransition = 400;
            }
            setTimeout(() => {
                currentPageState.value = destination;
                result[0].transitionFunction();
            }, waitBeforeTransition);
        } else {
            console.log("origin: " + currentPageState.value + " | destination: " + destination);
            console.error("Illegaaaaaaaaaaaaaaal Page Transition");
        }
    }
}

//page Transitions

function mainMenuToSettingsPage() {
    console.log("current page: " + currentPageState.value);
}

function multiMenuToRoomListing() {
    console.log("current page: " + currentPageState.value);
}

function mainMenuToMultiMenu() {
    console.log("current page: " + currentPageState.value);
}

function mainMenuToSoloMenu() {
    console.log("current page: " + currentPageState.value);
}

function multiMenuToSoloMenu() {
    console.log("current page: " + currentPageState.value);
}

function settingsPageToMainMenu() {
    console.log("current page: " + currentPageState.value);
}

function roomListingToMultiMenu() {
    console.log("current page: " + currentPageState.value);
}

function roomListingToRoomPage() {
    console.log("current page: " + currentPageState.value);
}

function roomPageToRoomListing() {
    console.log("current page: " + currentPageState.value);
}

function roomPageToMultiMenu() {
    console.log("current page: " + currentPageState.value);
}

function soloMenuToMainMenu() {
    console.log("current page: " + currentPageState.value);
}

function gamePageToMainMenu() {
    console.log("current page: " + currentPageState.value);
}

function gamePageToRoomPage() {
    console.log("current page: " + currentPageState.value);
}

function spintPageToSoloMenu() {
    console.log("current page: " + currentPageState.value);
}

function soloMenuToSprintPage() {
    console.log("current page: " + currentPageState.value);
}

function multiMenuToMainMenu() {
    console.log("current page: " + currentPageState.value);
}

function soloMenuToMultiMenu() {
    console.log("current page: " + currentPageState.value);
}

function soloMenuTosettingsPage() {
    console.log("current page: " + currentPageState.value);
}

function multiMenuToSettingsPage() {
    console.log("current page: " + currentPageState.value);
}

function settingsPageToMultiMenu() {
    console.log("current page: " + currentPageState.value);
}

function settingsPageToSoloMenu() {
    console.log("current page: " + currentPageState.value);
}

//overlay Transitions
const isChannelOpen = ref(false);

export function openChannelOverlay() {
    isChannelOpen.value = true;
}

export function closeChannelOverlay() {
    isChannelOpen.value = false;
}

export function isChannelActive() {
    return isChannelOpen;
}

export function changeBackgroundTo(color: string) {
    document.body.style.background = color;
}

export function resetBackground() {
    document.body.style.background = "";
}

export function getFlagImagePath(countryCode: string) {
    if (countryCode) {
        return require(`@/img/countryFlags/${countryCode.toLowerCase()}.svg`);
    }
}

export function formatDateTime(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substr(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    /* return `${day}.${month}.${year} ${hours}:${minutes}`; */
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

export function formatDateToAgoText(date: Date | string) {
    if (!date) {
      return '';
    }

    const now = new Date();
    const targetDate = new Date(date);
    const seconds = Math.round((now.getTime() - targetDate.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const weeks = Math.round(days / 7);
    const months = Math.round(days / 30.44); // More precise average days per month
    const years = Math.round(months / 12);

    if (seconds < 60) {
      return 'just now';
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (weeks < 4.345) { // Using the average number of weeks in a month
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }