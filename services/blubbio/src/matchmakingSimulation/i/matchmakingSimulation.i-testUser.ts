export interface TestUser {
    name: string;
    rating: number;
    ratingDeviation: number;
    volatility: number;
    searchStart?: number;
    loopsInQueue: number;
    amountOfQueues: number;
    maxAmountOfQueues: number;
    startDeviation: number;
}