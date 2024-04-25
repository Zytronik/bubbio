import { PAGE_STATE } from "./e/page.e-page-state";
import { PageTransition } from "./i/page.i.page-transition";

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

export const settingsPageToSoloMenuTransition: PageTransition = {
    name: "settingsPageToSoloMenuTransition",
    origin: PAGE_STATE.settingsPage,
    destination: PAGE_STATE.soloMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + settingsPageToSoloMenuTransition.name);
    }
}

export const settingsPageToMultiMenuTransition: PageTransition = {
    name: "settingsPageToMultiMenuTransition",
    origin: PAGE_STATE.settingsPage,
    destination: PAGE_STATE.multiMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + settingsPageToMultiMenuTransition.name);
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

export const roomListingToRankedPageTransition: PageTransition = {
    name: "roomListingToRankedPageTransition",
    origin: PAGE_STATE.roomListing,
    destination: PAGE_STATE.rankedPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + roomListingToRankedPageTransition.name);
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

export const soloMenuToScorePageTransition: PageTransition = {
    name: "soloMenuToScorePageTransition",
    origin: PAGE_STATE.soloMenu,
    destination: PAGE_STATE.scorePage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + soloMenuToScorePageTransition.name);
    }
}

export const soloMenuToMultiMenuTransition: PageTransition = {
    name: "soloMenuToMultiMenuTransition",
    origin: PAGE_STATE.soloMenu,
    destination: PAGE_STATE.multiMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + soloMenuToMultiMenuTransition.name);
    }
}

export const soloMenuTosettingsPageTransition: PageTransition = {
    name: "soloMenuTosettingsPageTransition",
    origin: PAGE_STATE.soloMenu,
    destination: PAGE_STATE.settingsPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + soloMenuTosettingsPageTransition.name);
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

export const spintPageToScorePageTransition: PageTransition = {
    name: "spintPageToScorePageTransition",
    origin: PAGE_STATE.sprintPage,
    destination: PAGE_STATE.scorePage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + spintPageToScorePageTransition.name);
    }
}

/* ScorePage */
export const scorePageToSoloMenuTransition: PageTransition = {
    name: "scorePageToSoloMenuTransition",
    origin: PAGE_STATE.scorePage,
    destination: PAGE_STATE.soloMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + scorePageToSoloMenuTransition.name);
    }
}

export const scorePageToSprintPageTransition: PageTransition = {
    name: "scorePageToSprintPageTransition",
    origin: PAGE_STATE.scorePage,
    destination: PAGE_STATE.sprintPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + scorePageToSprintPageTransition.name);
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

export const multiMenuToRankedPageTransition: PageTransition = {
    name: "multiMenuToRankedPageTransition",
    origin: PAGE_STATE.multiMenu,
    destination: PAGE_STATE.rankedPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + multiMenuToRankedPageTransition.name);
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

export const multiMenuToSettingsPageTransition: PageTransition = {
    name: "multiMenuToSettingsPageTransition",
    origin: PAGE_STATE.multiMenu,
    destination: PAGE_STATE.settingsPage,
    transitionFunction: () => {
        console.error("transition not yet defined for " + multiMenuToSettingsPageTransition.name);
    }
}

export const multiMenuToSoloMenuTransition: PageTransition = {
    name: "multiMenuToSoloMenuTransition",
    origin: PAGE_STATE.multiMenu,
    destination: PAGE_STATE.soloMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + multiMenuToSoloMenuTransition.name);
    }
}

/* Ranked Page */
export const rankedPageToMultiMenuTransition: PageTransition = {
    name: "rankedPageToMultiMenuTransition",
    origin: PAGE_STATE.rankedPage,
    destination: PAGE_STATE.multiMenu,
    transitionFunction: () => {
        console.error("transition not yet defined for " + rankedPageToMultiMenuTransition.name);
    }
}

export const rankedPageToRoomListingTransition: PageTransition = {
    name: "rankedPageToRoomListingTransition",
    origin: PAGE_STATE.rankedPage,
    destination: PAGE_STATE.roomListing,
    transitionFunction: () => {
        console.error("transition not yet defined for " + rankedPageToRoomListingTransition.name);
    }
}

export const allPossibleTransitions: PageTransition[] = [
    mainMenuToSettingsPageTransition,
    multiMenuToRoomListingTransition,
    mainMenuToMultiMenuTransition,
    multiMenuToSoloMenuTransition,
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
    soloMenuToMultiMenuTransition,
    soloMenuTosettingsPageTransition,
    multiMenuToSettingsPageTransition,
    settingsPageToSoloMenuTransition,
    settingsPageToMultiMenuTransition,
    multiMenuToRankedPageTransition,
    rankedPageToMultiMenuTransition,
    roomListingToRankedPageTransition,
    rankedPageToRoomListingTransition,
    scorePageToSoloMenuTransition,
    soloMenuToScorePageTransition,
    scorePageToSprintPageTransition,
    spintPageToScorePageTransition,
];
