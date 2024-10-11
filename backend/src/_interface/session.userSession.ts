import { RankInfo } from './ranked.rank';

export interface UserDetails {
    id: number;
    email: string;
    countryCode?: string;
    country?: string;
    pbUrl?: string;
    bannerUrl?: string;
    inputSettings?: string;
    LastDisconnectedAt: Date;
    rating: number;
    ratingDeviation: number;
    volatility: number;
    createdAt: Date;
    rank: RankInfo;
    globalRank: number;
    percentile: number;
    probablyAroundRank: RankInfo;
}

export interface UserSession {
    role: 'guest' | 'spectator' | 'user' | null;
    username: string;
    currentPage: string;
    clientId: string;
    isRanked: boolean;
    userDetails: UserDetails;
}
