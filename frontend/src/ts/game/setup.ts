import { Container, Sprite } from "pixi.js";
import { GAME_MODE } from "../_enum/gameMode";
import { Bubble } from "../_interface/game/bubble";
import { Field } from "../_interface/game/field";
import { Game } from "../_interface/game/game";
import { GameInstance } from "../_interface/game/gameInstance";
import { GameSettings } from "../_interface/game/gameSettings";
import { GameStats } from "../_interface/game/gameStats";
import { Grid } from "../_interface/game/grid";
import { RoundData } from "../_interface/game/roundData";
import { Row } from "../_interface/game/row";
import { getNextSeed } from "./rng";
import { SPRINT_SETTINGS } from "./settings/sprintSettings";
import { INPUT_CONTEXT } from "../_enum/inputContext";
import { HANDLING_SETTINGS } from "./settings/handlingSettings";
import { GameSprites } from "../_interface/game/gameSprites";
import { arrowTexture } from "../pixi/allTextures";
import { addAngleUpdateAnimation } from "../animationPixi/angleAnimation";
import { gameContainer, createGameInstanceContainer } from "../pixi/containers";

export function getEmptyGame(): Game {
    return {
        gameMode: GAME_MODE.NONE,
        inputContext: INPUT_CONTEXT.DISABLED,
        spectating: false,
        rounds: [],
        instancesMap: new Map<string, GameInstance>()
    }
}

export function getEmptyRoundData(): RoundData {
    return {
        initialSeed: getNextSeed(Date.now()),
        gameStartTime: 0,
    }
}

export function newSprintInstance(): GameInstance {
    const instance: GameInstance = {
        gameSettings: SPRINT_SETTINGS,
        handlingSettings: HANDLING_SETTINGS,
        bubbleSeed: 0,
        garbageSeed: 0,
        angle: 90,
        currentBubble: getDefaultBubble(),
        bubbleQueue: [],
        playGrid: getEmptyGrid(SPRINT_SETTINGS),
        queuedGarbage: {},
        stats: getEmptyStats(),
        left: false,
        right: false,
        aps: HANDLING_SETTINGS.defaultAPS,
        gameSprites: getAllGameSprites(),
        animationContainer: createGameInstanceContainer(),
        instanceAnimations: [],
    }
    addAngleUpdateAnimation(instance);
    return instance;
}

function getDefaultBubble(): Bubble {
    return {
        type: 0,
        wallbounce: false,
    }
}

function getEmptyGrid(settings: GameSettings): Grid {
    const precisionWidth = settings.widthPrecisionUnits;
    const bubblePrecisionRadius = precisionWidth / (2 * settings.gridWidth);
    const bubblePrecisionDiameter = bubblePrecisionRadius * 2;
    const precisionRowHeight = Math.floor(bubblePrecisionRadius * Math.sqrt(3));
    const precisionHeight = precisionRowHeight * (settings.gridHeight + settings.gridExtraHeight)
    const playGrid: Grid = {
        gridWidth: settings.gridWidth,
        gridHeight: settings.gridHeight,
        extraGridHeight: settings.gridExtraHeight,
        bubblePrecisionRadius,
        precisionWidth,
        precisionRowHeight,
        precisionHeight,
        rows: [],
        launcherPrecisionPosition: { x: precisionWidth / 2, y: precisionHeight - bubblePrecisionRadius },
        collisionRangeSquared: 0
    }
    for (let h = 0; h < playGrid.gridHeight + playGrid.extraGridHeight; h++) {
        const isSmallRow = (h % 2 === 1);
        const row: Row = {
            fields: [],
            size: playGrid.gridWidth - (isSmallRow ? 1 : 0),
            isSmallerRow: isSmallRow,
            isInDeathZone: h >= playGrid.gridHeight,
        }
        for (let w = 0; w < row.size; w++) {
            const field: Field = {
                coords: { x: w, y: h, },
                precisionCoords: {
                    x: w * bubblePrecisionDiameter + (isSmallRow ? bubblePrecisionDiameter : bubblePrecisionRadius),
                    y: precisionRowHeight * h + bubblePrecisionRadius,
                },
            };
            row.fields.push(field)
        }
        playGrid.rows.push(row);
    }
    return playGrid;
}

export function getEmptyStats(): GameStats {
    return {
        bubblesShot: 0,
        bubblesCleared: 0,
        attack: 0,
        clears: [[]],
        perfectClears: 0,
        currentCombo: 0,
        highestCombo: 0
    }
}

function getAllGameSprites(): GameSprites {
    return {
        arrow: new Sprite(arrowTexture.texture),
    }
}