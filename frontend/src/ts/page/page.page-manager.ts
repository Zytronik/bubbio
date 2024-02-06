import { checkUserAuthentication, logUserOut } from "../networking/networking.auth";
import { PAGE_STATE } from "./page.e-page-state";
import { mainMenuToSettingsPageTransition, allPossibleTransitions, gamePageToMainMenuTransition, gamePageToRoomPageTransition, mainMenuToGamePageTransition, mainMenuToRoomListingTransition, myPageToMainMenuTransition, roomListingToMainMenuTransition, roomListingToRoomPageTransition, roomPageToRoomListingTransition, settingsPageToMainMenuTransition, mainMenuToMyPageTransition, roomPageToMainMenuTransition, mainMenuToRoomPageTransition, mainMenuToSprintPageTransition, spintPageToMainMenuTransition } from "./page.possible-transitions";
import { Page } from "./page.i-page";
import StartMenu from '../../pages/startmenu/StartMenu.vue';
import Room from '../../pages/room/Room.vue';
import Game from '../../pages/game/Game.vue';
import Sprint from '../../pages/sprint/Sprint.vue';
import Config from '../../pages/config/Config.vue';
import RoomListing from '../../pages/room-listing/RoomListing.vue';
import Me from '../../pages/me/Me.vue';
import { ref } from 'vue';

export const pages: Page[] = [
    { title: 'StartMenu', pageState: PAGE_STATE.mainMenu, component: StartMenu },
    { title: 'RoomListing', pageState: PAGE_STATE.roomListing, component: RoomListing },
    { title: 'Room', pageState: PAGE_STATE.roomPage, component: Room },
    { title: 'Me', pageState: PAGE_STATE.myPage, component: Me },
    { title: 'Config', pageState: PAGE_STATE.settingsPage, component: Config },
    { title: 'Game', pageState: PAGE_STATE.gamePage, component: Game },
    { title: 'Sprint', pageState: PAGE_STATE.sprintPage, component: Sprint },
];

export function setupTransitionFunctions() {
    mainMenuToSettingsPageTransition.transitionFunction = mainMenuToSettingsPage;
    mainMenuToRoomListingTransition.transitionFunction = mainMenuToRoomListing;
    mainMenuToGamePageTransition.transitionFunction = mainMenuToGamePage;
    mainMenuToMyPageTransition.transitionFunction = mainMenuToMyPage;
    mainMenuToRoomPageTransition.transitionFunction = mainMenuToRoomPage;
    settingsPageToMainMenuTransition.transitionFunction = settingsPageToMainMenu;
    roomListingToMainMenuTransition.transitionFunction = roomListingToMainMenu;
    roomListingToRoomPageTransition.transitionFunction = roomListingToRoomPage;
    roomPageToRoomListingTransition.transitionFunction = roomPageToRoomListing;
    roomPageToMainMenuTransition.transitionFunction = roomPageToMainMenu;
    myPageToMainMenuTransition.transitionFunction = myPageToMainMenu;
    gamePageToMainMenuTransition.transitionFunction = gamePageToMainMenu;
    gamePageToRoomPageTransition.transitionFunction = gamePageToRoomPage;
    spintPageToMainMenuTransition.transitionFunction = spintPageToMainMenu;
    mainMenuToSprintPageTransition.transitionFunction = mainMenuToSprintPage;
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
            console.log("origin: " + currentPageState.value);
            console.log("destination: " + destination);
            console.error("Illegaaaaaaaaaaaaaaal Page Transition");
        }
    }
}

//page Transitions

function mainMenuToSettingsPage() {
    console.log("current page: " + currentPageState.value);
}

function mainMenuToRoomListing() {
    console.log("current page: " + currentPageState.value);
}

function mainMenuToGamePage() {
    console.log("current page: " + currentPageState.value);
}

function mainMenuToMyPage() {
    console.log("current page: " + currentPageState.value);
}

function mainMenuToRoomPage() {
    console.log("current page: " + currentPageState.value);
}

function settingsPageToMainMenu() {
    console.log("current page: " + currentPageState.value);
}

function roomListingToMainMenu() {
    console.log("current page: " + currentPageState.value);
}

function roomListingToRoomPage() {
    console.log("current page: " + currentPageState.value);
}

function roomPageToRoomListing() {
    console.log("current page: " + currentPageState.value);
}

function roomPageToMainMenu() {
    console.log("current page: " + currentPageState.value);
}

function myPageToMainMenu() {
    console.log("current page: " + currentPageState.value);
}

function gamePageToMainMenu() {
    console.log("current page: " + currentPageState.value);
}

function gamePageToRoomPage() {
    console.log("current page: " + currentPageState.value);
}

function spintPageToMainMenu() {
    console.log("current page: " + currentPageState.value);
}

function mainMenuToSprintPage() {
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