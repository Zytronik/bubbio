import { PageState } from "./page.e-page-state";
import { PageTransition } from "./page.i-page-transition";

export const mainMenuToSettingsPageTransition: PageTransition = {
    name: "mainMenuToSettingsPageTransition",
    origin: PageState.mainMenu,
    destination: PageState.settingsPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToSettingsPageTransition.name);
    }
}

export const mainMenuToRoomListingTransition: PageTransition = {
    name: "mainMenuToRoomListingTransition",
    origin: PageState.mainMenu,
    destination: PageState.roomListing,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToRoomListingTransition.name);
    }
}

export const mainMenuToGamePageTransition: PageTransition = {
    name: "mainMenuToGamePageTransition",
    origin: PageState.mainMenu,
    destination: PageState.gamePage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToGamePageTransition.name);
    }
}

export const mainMenuToMyPageTransition: PageTransition = {
    name: "mainMenuToMyPageTransition",
    origin: PageState.mainMenu,
    destination: PageState.myPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToMyPageTransition.name);
    }
}

export const mainMenuToRoomPageTransition: PageTransition = {
    name: "mainMenuToRoomPageTransition",
    origin: PageState.mainMenu,
    destination: PageState.roomPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToRoomPageTransition.name);
    }
}

export const settingsPageToMainMenuTransition: PageTransition = {
    name: "settingsPageToMainMenuTransition",
    origin: PageState.settingsPage,
    destination: PageState.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + settingsPageToMainMenuTransition.name);
    }
}

export const roomListingToMainMenuTransition: PageTransition = {
    name: "roomListingToMainMenuTransition",
    origin: PageState.roomListing,
    destination: PageState.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + roomListingToMainMenuTransition.name);
    }
}

export const roomListingToRoomPageTransition: PageTransition = {
    name: "roomListingToRoomPageTransition",
    origin: PageState.roomListing,
    destination: PageState.roomPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + roomListingToRoomPageTransition.name);
    }
}

export const roomPageToRoomListingTransition: PageTransition = {
    name: "roomPageToRoomListingTransition",
    origin: PageState.roomPage,
    destination: PageState.roomListing,
    transitionFunction: () => {
        console.error("transition not yet defined for " + roomPageToRoomListingTransition.name);
    }
}

export const roomPageToMainMenuTransition: PageTransition = {
    name: "roomPageToMainMenuTransition",
    origin: PageState.roomPage,
    destination: PageState.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + roomPageToMainMenuTransition.name);
    }
}

export const myPageToMainMenuTransition: PageTransition = {
    name: "myPageToMainMenuTransition",
    origin: PageState.myPage,
    destination: PageState.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + myPageToMainMenuTransition.name);
    }
}

export const gamePageToMainMenuTransition: PageTransition = {
    name: "gamePageToMainMenuTransition",
    origin: PageState.gamePage,
    destination: PageState.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + gamePageToMainMenuTransition.name);
    }
}

export const gamePageToRoomPageTransition: PageTransition = {
    name: "gamePageToRoomPageTransition",
    origin: PageState.gamePage,
    destination: PageState.roomPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + gamePageToRoomPageTransition.name);
    }
}

export const spintPageToMainMenuTransition: PageTransition = {
    name: "spintPageToMainMenuTransition",
    origin: PageState.sprintPage,
    destination: PageState.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + spintPageToMainMenuTransition.name);
    }
}

export const mainMenuToSprintPageTransition: PageTransition = {
    name: "mainMenuToSprintPageTransition",
    origin: PageState.mainMenu,
    destination: PageState.sprintPage,
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
