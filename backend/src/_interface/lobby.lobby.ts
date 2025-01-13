export interface Lobby {
  id: string;
  name: string;
  users: LobbyUser[];
}

export interface LobbyUser {
  socketId: string;
  username: string;
  isHost: boolean;
  isGuest: boolean;
  userId: number;
}

// Payloads
export interface JoinLobbyPayload {
  lobbyId: string;
}

export interface LeaveLobbyPayload {
  lobbyId: string;
}

export interface LobbyUpdate {
  lobbyId: string;
  users: LobbyUser[];
}
