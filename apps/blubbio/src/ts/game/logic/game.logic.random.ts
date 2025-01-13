export function getNextSeed(seed: number): number {
    let nextSeed = seed;
    nextSeed ^= (nextSeed << 21);
    nextSeed ^= (nextSeed >>> 35);
    nextSeed ^= (nextSeed << 4);
    return nextSeed;
}

//max is not included: [min, max[
export function convertSeedToRandomNumber(min: number, max: number, seed: number): number {
    min = Math.floor(min);
    max = Math.ceil(max);
    const random = (seed & 0x7FFFFFFF) / 0x80000000;
    return Math.floor(random * (max - min)) + min;
}

//change this to mersene twister at some point