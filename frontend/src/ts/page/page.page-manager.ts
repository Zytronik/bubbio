import { checkUserAuthentication, logUserOut } from "../networking/networking.auth";
import { PAGE_STATE } from "./page.e-page-state";
import { mainMenuToSettingsPageTransition, allPossibleTransitions, gamePageToMainMenuTransition, gamePageToRoomPageTransition, mainMenuToMultiMenuTransition, roomListingToMultiMenuTransition, roomListingToRoomPageTransition, roomPageToRoomListingTransition, settingsPageToMainMenuTransition, roomPageToMultiMenuTransition, multiMenuToRoomPageTransition, soloMenuToSprintPageTransition, spintPageToSoloMenuTransition, mainMenuToSoloMenuTransition, soloMenuToMainMenuTransition, multiMenuToRoomListingTransition, multiMenuToMainMenuTransition } from "./page.possible-transitions";
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
    multiMenuToRoomPageTransition.transitionFunction = multiMenuToRoomPage;
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
}

export const currentPageState = ref<PAGE_STATE>(PAGE_STATE.mainMenu);

export function goToState(destination: PAGE_STATE) {
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
            currentPageState.value = destination;
            result[0].transitionFunction();
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

function multiMenuToRoomPage() {
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

function multiMenuToMainMenu(){
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