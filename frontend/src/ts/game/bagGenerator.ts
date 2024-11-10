import { Bubble } from "../_interface/game/bubble";

function getBubbleBag(): Bubble[] {
    // const bagSize = gameInstance.gameSettings.bubbleBagSize;
    const bag: Bubble[] = [];
    // const leftOverBubbles = [...allBubbles];
    // while (bag.length < bagSize) {
    //     if (leftOverBubbles.length === 0) {
    //         leftOverBubbles.push(...allBubbles);
    //     }
    //     const randomIndex = convertSeedToRandomNumber(0, leftOverBubbles.length, gameInstance.bubbleSeed);
    //     gameInstance.bubbleSeed = getNextSeed(gameInstance.bubbleSeed);
    //     bag.push(leftOverBubbles.splice(randomIndex, 1)[0]);
    // }
    return bag;
}
