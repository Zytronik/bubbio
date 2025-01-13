export interface RankInfo {
    ascii: string;
    name: string;
    iconName: string;
    percentile: number;
    prevRank?: Rank;
    nextRank?: Rank;
    isRanked: boolean;
}

export interface Rank {
    ascii: string;
    percentile: number;
    name: string;
    iconName: string;
}