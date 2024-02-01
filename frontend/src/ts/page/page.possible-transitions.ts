import { PAGE_STATE } from "./page.e-page-state";
import { PageTransition } from "./page.i-page-transition";

export const mainMenuToSettingsPageTransition: PageTransition = {
    name: "mainMenuToSettingsPageTransition",
    origin: PAGE_STATE.mainMenu,
    destination: PAGE_STATE.settingsPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToSettingsPageTransition.name);
    }
}

export const mainMenuToRoomListingTransition: PageTransition = {
    name: "mainMenuToRoomListingTransition",
    origin: PAGE_STATE.mainMenu,
    destination: PAGE_STATE.roomListing,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToRoomListingTransition.name);
    }
}

export const mainMenuToGamePageTransition: PageTransition = {
    name: "mainMenuToGamePageTransition",
    origin: PAGE_STATE.mainMenu,
    destination: PAGE_STATE.gamePage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToGamePageTransition.name);
    }
}

export const mainMenuToMyPageTransition: PageTransition = {
    name: "mainMenuToMyPageTransition",
    origin: PAGE_STATE.mainMenu,
    destination: PAGE_STATE.myPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToMyPageTransition.name);
    }
}

export const mainMenuToRoomPageTransition: PageTransition = {
    name: "mainMenuToRoomPageTransition",
    origin: PAGE_STATE.mainMenu,
    destination: PAGE_STATE.roomPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToRoomPageTransition.name);
    }
}

export const settingsPageToMainMenuTransition: PageTransition = {
    name: "settingsPageToMainMenuTransition",
    origin: PAGE_STATE.settingsPage,
    destination: PAGE_STATE.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + settingsPageToMainMenuTransition.name);
    }
}

export const roomListingToMainMenuTransition: PageTransition = {
    name: "roomListingToMainMenuTransition",
    origin: PAGE_STATE.roomListing,
    destination: PAGE_STATE.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + roomListingToMainMenuTransition.name);
    }
}

export const roomListingToRoomPageTransition: PageTransition = {
    name: "roomListingToRoomPageTransition",
    origin: PAGE_STATE.roomListing,
    destination: PAGE_STATE.roomPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + roomListingToRoomPageTransition.name);
    }
}

export const roomPageToRoomListingTransition: PageTransition = {
    name: "roomPageToRoomListingTransition",
    origin: PAGE_STATE.roomPage,
    destination: PAGE_STATE.roomListing,
    transitionFunction: () => {
        console.error("transition not yet defined for " + roomPageToRoomListingTransition.name);
    }
}

export const roomPageToMainMenuTransition: PageTransition = {
    name: "roomPageToMainMenuTransition",
    origin: PAGE_STATE.roomPage,
    destination: PAGE_STATE.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + roomPageToMainMenuTransition.name);
    }
}

export const myPageToMainMenuTransition: PageTransition = {
    name: "myPageToMainMenuTransition",
    origin: PAGE_STATE.myPage,
    destination: PAGE_STATE.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + myPageToMainMenuTransition.name);
    }
}

export const gamePageToMainMenuTransition: PageTransition = {
    name: "gamePageToMainMenuTransition",
    origin: PAGE_STATE.gamePage,
    destination: PAGE_STATE.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + gamePageToMainMenuTransition.name);
    }
}

export const gamePageToRoomPageTransition: PageTransition = {
    name: "gamePageToRoomPageTransition",
    origin: PAGE_STATE.gamePage,
    destination: PAGE_STATE.roomPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + gamePageToRoomPageTransition.name);
    }
}

export const spintPageToMainMenuTransition: PageTransition = {
    name: "spintPageToMainMenuTransition",
    origin: PAGE_STATE.sprintPage,
    destination: PAGE_STATE.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + spintPageToMainMenuTransition.name);
    }
}

export const mainMenuToSprintPageTransition: PageTransition = {
    name: "mainMenuToSprintPageTransition",
    origin: PAGE_STATE.mainMenu,
    destination: PAGE_STATE.sprintPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToSprintPageTransition.name);
    }
}

export const allPossibleTransitions: PageTransition[] = [
    mainMenuToSettingsPageTransition,
    mainMenuToRoomListingTransition,
    mainMenuToGamePageTransition,
    mainMenuToMyPageTransition,
    mainMenuToRoomPageTransition,
    settingsPageToMainMenuTransition,
    roomListingToMainMenuTransition,
    roomListingToRoomPageTransition,
    roomPageToRoomListingTransition,
    roomPageToMainMenuTransition,
    myPageToMainMenuTransition,
    gamePageToMainMenuTransition,
    gamePageToRoomPageTransition,
    spintPageToMainMenuTransition,
    mainMenuToSprintPageTransition,
];
