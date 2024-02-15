export function getNextSeed(seed: number): number {
    let nextSeed = seed;
    nextSeed ^= (nextSeed << 21);
    nextSeed ^= (nextSeed >>> 35);
    nextSeed ^= (nextSeed << 4);
    return nextSeed;
}

export function convertSeedToRandomNumber(min: number, max: number, seed: number): number {
    min = Math.floor(min);
    max = Math.ceil(max);
    let random = seed & 0x7FFFFFFF;
    return Math.floor(random * (max - min)) + min;
}