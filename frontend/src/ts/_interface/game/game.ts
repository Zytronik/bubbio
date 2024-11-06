import { GAME_MODE } from "@/ts/_enum/gameMode";
import { GameInstance } from "./gameInstance";
import { UserSession } from "../userSession";
import { RoundData } from "./roundData";

export interface Game {
    gameMode: GAME_MODE,
    spectating: boolean,
    rounds: RoundData[],
    instancesMap: Map<UserSession, GameInstance>,
}

/*
sprint
one player
win condition
*/