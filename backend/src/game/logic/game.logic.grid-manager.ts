import { Field } from "../i/game.i.field";
import { Grid } from "../i/game.i.grid";
import { Row } from "../i/game.i.row";
import { Coordinates } from "../i/game.i.grid-coordinates";
import { GameSettings } from "../i/game.i.game-settings";

export function setupGrid(settings: GameSettings): Grid {
    const precisionWidth = settings.widthPrecisionUnits.value;
    const bubbleRadius = precisionWidth / (2 * settings.gridWidth.value);
    const bubbleDiameter = bubbleRadius * 2;
    const precisionRowHeight = Math.floor(bubbleRadius * Math.sqrt(3));
    const precisionHeight = precisionRowHeight * (settings.gridHeight.value + settings.gridExtraHeight.value)
    const playGrid: Grid = {
        precisionWidth: precisionWidth,
        precisionHeight: precisionHeight,
        precisionRowHeight: precisionRowHeight,
        gridWidth: settings.gridWidth.value,
        gridHeight: settings.gridHeight.value,
        extraGridHeight: settings.gridExtraHeight.value,
        rows: [],
        bubbleRadius: bubbleRadius,
        bubbleLauncherPosition: { x: precisionWidth / 2, y: precisionHeight - bubbleRadius },
        collisionRangeSquared: ((bubbleRadius * 2) ** 2) * settings.collisionDetectionFactor.value,
        dissolveFloatingBubbles: settings.dissolveFloatingBubbles.value,
    }
    for (let h = 0; h < playGrid.gridHeight + playGrid.extraGridHeight; h++) {
        const isEvenRow = (h % 2 === 0);
        const row: Row = {
            fields: [],
            size: playGrid.gridWidth - (isEvenRow ? 0 : 1),
            isEvenRow: h % 2 === 0,
            isInDeathZone: h >= playGrid.gridHeight,
        }
        for (let w = 0; w < row.size; w++) {
            const field: Field = {
                coords: { x: w, y: h, },
                centerPointCoords: {
                    x: w * bubbleDiameter + (isEvenRow ? bubbleRadius : bubbleDiameter),
                    y: precisionRowHeight * h + bubbleRadius,
                },
            };
            row.fields.push(field)
        }
        playGrid.rows.push(row);
    }
    return playGrid;
}

export function getNearbyFields(playGrid: Grid, pointPosition: Coordinates): Field[] {
    const bubbleRadius = playGrid.bubbleRadius;
    const bubbleDiameter = playGrid.bubbleRadius * 2;
    const row = Math.round((pointPosition.y - bubbleRadius) / playGrid.precisionRowHeight);
    const isEvenRow = playGrid.rows[row].isEvenRow;
    const xOffSet = (isEvenRow ? bubbleRadius : bubbleDiameter)
    const column = Math.round((pointPosition.x - xOffSet) / bubbleDiameter);
    const nearbyFields: Field[] = []
    getAdjacentFieldVectors(playGrid, { x: column, y: row }).forEach(fieldVector => {
        const x = column + fieldVector.x;
        const y = row + fieldVector.y;
        if (playGrid.rows[y] && playGrid.rows[y].fields[x]) {
            nearbyFields.push(playGrid.rows[y].fields[x]);
        }
    })
    return nearbyFields;
}

export function dissolveBubbles(playGrid: Grid, collidedAtField: Field): number {
    let dissolvedBubblesAmount = 0;
    const komma = ','
    const x = collidedAtField.coords.x;
    const y = collidedAtField.coords.y;
    const colorToCheck = collidedAtField.bubble!.type;
    const visited = new Set<string>();
    const result = new Set<string>();
    findAdjacentBubbles(x, y, colorToCheck, visited, result);
    if (result.size >= 3) {
        result.forEach(xyString => {
            const x = parseInt(xyString.split(komma)[0]);
            const y = parseInt(xyString.split(komma)[1]);
            getField(x, y).bubble = undefined;
        })
        dissolvedBubblesAmount += result.size;
    }
    if (playGrid.dissolveFloatingBubbles) {
        const unconnected = getFreeFloatingBubbles();
        unconnected.forEach(xyString => {
            const x = parseInt(xyString.split(komma)[0]);
            const y = parseInt(xyString.split(komma)[1]);
            getField(x, y).bubble = undefined;
            dissolvedBubblesAmount++;
        })
    }
    return dissolvedBubblesAmount;

    function findAdjacentBubbles(x: number, y: number, colorToCheck: number, visited: Set<string>, result: Set<string>): void {
        const isInBounds = playGrid.rows[y] != undefined && playGrid.rows[y].fields[x] != undefined;
        const alreadyTraversed = visited.has(`${x}${komma}${y}`);
        if (alreadyTraversed || !isInBounds) {
            return;
        }
        visited.add(`${x}${komma}${y}`);

        const field = getField(x, y);
        if (!field.bubble || field.bubble.type !== colorToCheck) {
            return;
        }

        result.add(`${x}${komma}${y}`);

        getAdjacentFieldVectors(playGrid, { x: x, y: y }).forEach(fieldVector => {
            const nextX = x + fieldVector.x;
            const nextY = y + fieldVector.y;
            findAdjacentBubbles(nextX, nextY, colorToCheck, visited, result);
        });
    }

    function getFreeFloatingBubbles(): Set<string> {
        const connected = new Set<string>();
        const unconnected = new Set<string>();
        playGrid.rows[0].fields.forEach(firstRowField => {
            findBubblesConnectoToTop(firstRowField.coords.x, firstRowField.coords.y, connected);
        });

        playGrid.rows.forEach(row => {
            row.fields.forEach(field => {
                const xyString = `${field.coords.x}${komma}${field.coords.y}`;
                if (!connected.has(xyString) && field.bubble) {
                    unconnected.add(xyString);
                }
            });
        });
        return unconnected;

        function findBubblesConnectoToTop(x: number, y: number, connected: Set<string>): void {
            const isInBounds = playGrid.rows[y] != undefined && playGrid.rows[y].fields[x] != undefined;
            const alreadyTraversed = connected.has(`${x}${komma}${y}`);
            if (!isInBounds || !playGrid.rows[y].fields[x].bubble || alreadyTraversed) {
                return;
            }

            connected.add(`${x}${komma}${y}`);

            getAdjacentFieldVectors(playGrid, { x: x, y: y }).forEach(fieldVector => {
                const nextX = x + fieldVector.x;
                const nextY = y + fieldVector.y;
                findBubblesConnectoToTop(nextX, nextY, connected);
            });
        }
    }

    function getField(x: number, y: number): Field {
        return playGrid.rows[y].fields[x]
    }
}

function getAdjacentFieldVectors(playGrid: Grid, gridPosition: Coordinates): Coordinates[] {
    const hexagonalShift = playGrid.rows[gridPosition.y].isEvenRow ? -1 : 1;
    const adjacentFieldVectors: Coordinates[] = [
        { x: 0, y: 0, },
        { x: -1, y: 0, },
        { x: 1, y: 0, },
        { x: hexagonalShift, y: -1, },
        { x: hexagonalShift, y: 1, },
        { x: 0, y: -1, },
        { x: 0, y: +1, },
    ]
    return adjacentFieldVectors;
}

// function addGarbage(): void {

// }
