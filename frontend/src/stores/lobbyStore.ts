import { defineStore } from 'pinia';
import { useSocketStore } from '@/stores/socketStore';
import {
  FailedJoinLobbyResponse,
  JoinLobbyPayload,
  LeaveLobbyPayload,
  Lobby,
  LobbyListResponse,
  LobbyUpdate,
  LobbyUser,
} from '@/ts/_interface/lobby';
import { transitionPageForwardsAnimation } from '@/ts/animationCSS/transitionPageForwards';
import { PAGE } from '@/ts/_enum/page';

export const useLobbyStore = defineStore('lobby', {
  state: () => ({
    lobbies: [] as Lobby[],
    currentLobby: null as Lobby | null,
  }),

  actions: {
    initLobbyListeners(): void {
      const socketStore = useSocketStore();

      if (!socketStore.webSocket) {
        console.error('WebSocket not initialized!');
        return;
      }

      const webSocket = socketStore.webSocket;

      webSocket.on('lobbyList', (response: LobbyListResponse) => {
        this.lobbies = response.lobbies;
      });

      webSocket.on('lobbyUpdate', (update: LobbyUpdate) => {
        const lobby = this.lobbies.find(l => l.id === update.lobbyId);
        if (lobby) {
          lobby.users = update.users;
        }
        if (this.currentLobby?.id === update.lobbyId) {
          this.currentLobby.users = update.users;
        }
      });

      webSocket.on('lobbyCreated', (lobby: Lobby) => {
        this.currentLobby = lobby;
        this.modifyUrlOnJoin(lobby.id);
        transitionPageForwardsAnimation(PAGE.roomPage);
      });

      webSocket.on('lobbyJoined', (lobby: Lobby) => {
        this.currentLobby = lobby;
        this.modifyUrlOnJoin(lobby.id);
        transitionPageForwardsAnimation(PAGE.roomPage);
      });

      webSocket.on('lobbyJoinFailed', (response: FailedJoinLobbyResponse) => {
        console.error(`Failed to join lobby ${response.lobbyId}`);
        this.modifyUrlOnLeave();
      });
    },

    createLobby(): void {
      const socketStore = useSocketStore();
      if (socketStore.webSocket) {
        socketStore.webSocket.emit('createLobby');
      } else {
        console.error('WebSocket not initialized!');
      }
    },

    joinLobby(lobbyId: string): void {
      const socketStore = useSocketStore();
      if (socketStore.webSocket) {
        const payload: JoinLobbyPayload = { lobbyId };
        socketStore.webSocket.emit('joinLobby', payload);
      } else {
        console.error('WebSocket not initialized!');
      }
    },

    leaveLobby(lobbyId: string): void {
      const socketStore = useSocketStore();
      if (socketStore.webSocket) {
        const payload: LeaveLobbyPayload = { lobbyId };
        socketStore.webSocket.emit('leaveLobby', payload);
        this.currentLobby = null;
        this.modifyUrlOnLeave();
      } else {
        console.error('WebSocket not initialized!');
      }
    },

    fetchLobbies(): Promise<void> {
      const socketStore = useSocketStore();
      if (!socketStore.webSocket) {
        console.error('WebSocket not initialized!');
        return Promise.reject('WebSocket not initialized!');
      }

      return new Promise(resolve => {
        const webSocket = socketStore.webSocket;

        const onLobbyList = (response: LobbyListResponse) => {
          this.lobbies = response.lobbies;
          webSocket?.off('lobbyList', onLobbyList);
          resolve();
        };

        webSocket?.on('lobbyList', onLobbyList);
        webSocket?.emit('fetchLobbies');
      });
    },

    modifyUrlOnJoin(lobbyId: string): void {
      window.location.hash = `#${lobbyId}`;
    },

    modifyUrlOnLeave(): void {
      history.replaceState(null, '', window.location.pathname);
    },
  },

  getters: {
    getLobbyById:
      state =>
      (lobbyId: string): Lobby | undefined => {
        return state.lobbies.find(lobby => lobby.id === lobbyId);
      },

    currentLobbyUsers: (state): LobbyUser[] => {
      return state.currentLobby?.users || [];
    },

    currentLobbyOwner: (state): LobbyUser | null => {
      return state.currentLobby?.users.find(user => user.isHost) || null;
    },
  },
});
