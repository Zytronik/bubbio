export class XORShift32 {
    private state: number;

    constructor(seed?: number) {
        if (seed === undefined) {
            seed = Date.now();
        }
        this.state = seed;
    }

    private xorshift(): number {
        let x = this.state;
        x ^= (x << 21);
        x ^= (x >>> 35);
        x ^= (x << 4);
        this.state = x;
        return x & 0x7FFFFFFF; // Ensure the result is a positive integer
    }

    // Get a random float in the range [0, 1[
    public random(): number {
        return this.xorshift() / 0x80000000;
    }

    // Get a random integer in a specified range [min, max[
    public randomInt(min: number, max: number): number {
        min = Math.floor(min);
        max = Math.ceil(max);
        return Math.floor(this.random() * (max - min)) + min;
    }
}