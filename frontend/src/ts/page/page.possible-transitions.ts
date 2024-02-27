import { PAGE_STATE } from "./page.e-page-state";
import { PageTransition } from "./page.i-page-transition";

/* MainMenu */
export const mainMenuToSettingsPageTransition: PageTransition = {
    name: "mainMenuToSettingsPageTransition",
    origin: PAGE_STATE.mainMenu,
    destination: PAGE_STATE.settingsPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToSettingsPageTransition.name);
    }
}

export const mainMenuToSoloMenuTransition: PageTransition = {
    name: "mainMenuToSoloMenuTransition",
    origin: PAGE_STATE.mainMenu,
    destination: PAGE_STATE.soloMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToSoloMenuTransition.name);
    }
}

export const mainMenuToMultiMenuTransition: PageTransition = {
    name: "mainMenuToMultiMenuTransition",
    origin: PAGE_STATE.mainMenu,
    destination: PAGE_STATE.multiMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + mainMenuToMultiMenuTransition.name);
    }
}

/*  SettingPage */
export const settingsPageToMainMenuTransition: PageTransition = {
    name: "settingsPageToMainMenuTransition",
    origin: PAGE_STATE.settingsPage,
    destination: PAGE_STATE.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + settingsPageToMainMenuTransition.name);
    }
}

/*  RoomListing */
export const roomListingToMultiMenuTransition: PageTransition = {
    name: "roomListingToMultiMenuTransition",
    origin: PAGE_STATE.roomListing,
    destination: PAGE_STATE.multiMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + roomListingToMultiMenuTransition.name);
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

/*  RoomPage */
export const roomPageToRoomListingTransition: PageTransition = {
    name: "roomPageToRoomListingTransition",
    origin: PAGE_STATE.roomPage,
    destination: PAGE_STATE.roomListing,
    transitionFunction: () => {
        console.error("transition not yet defined for " + roomPageToRoomListingTransition.name);
    }
}

export const roomPageToMultiMenuTransition: PageTransition = {
    name: "roomPageToMultiMenuTransition",
    origin: PAGE_STATE.roomPage,
    destination: PAGE_STATE.multiMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + roomPageToMultiMenuTransition.name);
    }
}

/*  GamePage */
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

/*  SoloMenu */
export const soloMenuToMainMenuTransition: PageTransition = {
    name: "soloMenuToMainMenuTransition",
    origin: PAGE_STATE.soloMenu,
    destination: PAGE_STATE.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + soloMenuToMainMenuTransition.name);
    }
}

export const soloMenuToSprintPageTransition: PageTransition = {
    name: "soloMenuToSprintPageTransition",
    origin: PAGE_STATE.soloMenu,
    destination: PAGE_STATE.sprintPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + soloMenuToSprintPageTransition.name);
    }
}

/*  SprintPage */
export const spintPageToSoloMenuTransition: PageTransition = {
    name: "spintPageToSoloMenuTransition",
    origin: PAGE_STATE.sprintPage,
    destination: PAGE_STATE.soloMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + spintPageToSoloMenuTransition.name);
    }
}

/* MultiMenu */
export const multiMenuToRoomListingTransition: PageTransition = {
    name: "multiMenuToRoomListingTransition",
    origin: PAGE_STATE.multiMenu,
    destination: PAGE_STATE.roomListing,
    transitionFunction: () => {
        console.error("transition not yet defined for " + multiMenuToRoomListingTransition.name);
    }
}

export const multiMenuToMainMenuTransition: PageTransition = {
    name: "multiMenuToMainMenuTransition",
    origin: PAGE_STATE.multiMenu,
    destination: PAGE_STATE.mainMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + multiMenuToMainMenuTransition.name);
    }
}

export const multiMenuToRoomPageTransition: PageTransition = {
    name: "multiMenuToRoomPageTransition",
    origin: PAGE_STATE.multiMenu,
    destination: PAGE_STATE.roomPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + multiMenuToRoomPageTransition.name);
    }
}

export const allPossibleTransitions: PageTransition[] = [
    mainMenuToSettingsPageTransition,
    multiMenuToRoomListingTransition,
    mainMenuToMultiMenuTransition,
    multiMenuToRoomPageTransition,
    settingsPageToMainMenuTransition,
    roomListingToMultiMenuTransition,
    roomListingToRoomPageTransition,
    roomPageToRoomListingTransition,
    roomPageToMultiMenuTransition,
    gamePageToMainMenuTransition,
    gamePageToRoomPageTransition,
    spintPageToSoloMenuTransition,
    soloMenuToSprintPageTransition,
    mainMenuToSoloMenuTransition,
    soloMenuToMainMenuTransition,
    multiMenuToMainMenuTransition,
];
