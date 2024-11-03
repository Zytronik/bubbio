import { UserDetails } from './session.userDetails';

export interface UserSession {
  role: 'guest' | 'spectator' | 'user' | null;
  username: string;
  currentPage: string;
  clientId: string;
  isRanked: boolean;
  userDetails: UserDetails;
}
