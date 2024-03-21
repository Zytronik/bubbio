import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { dto_GameSetup } from './network/dto/game.network.dto.game-setup';
import { OngoingGame } from './network/i/game.network.i.ongoing-game';
import { createGameInstance } from './logic/game.logic.instance-creator';
import { GameTransitions } from './i/game.i.game-transitions';
import { InputFrame } from './i/game.i.game-state-history';
import { GAME_INPUT } from './network/dto/game.network.dto.game-input';
import { executeShot } from './logic/game.logic.shoot';
import { holdBubble } from './logic/game.logic.bubble-manager';
import { dto_GameInstance } from './network/dto/game.network.dto.game-instance';
import { dto_SpectationEntry } from './network/dto/game.network.dto.spectation-entry';

const spectatorRoomName = 'spectatorRoom';
const ongoingGamesMap: Map<string, OngoingGame> = new Map(); //<client.id: string, OngoingGame>
@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {

  @WebSocketServer() 
  server: Server;

  handleDisconnect(client: Socket) {
    const game = ongoingGamesMap.get(client.id);
    if (game) {
      ongoingGamesMap.delete(client.id);
      this.server.to(spectatorRoomName).emit('updateSpectatorEntries', this.getSpectatorEntries());
    }
  }

  @SubscribeMessage('setupGame')
  setupGame(client: Socket, nd_GameSetup: dto_GameSetup): void {
    const gameMode = nd_GameSetup.gameMode;
    const gameSettings = nd_GameSetup.gameSettings;
    const handlingSettings = nd_GameSetup.handlingSettings;
    const seed = nd_GameSetup.seed;
    const transitions: GameTransitions = {
      onGameStart: function (): void {
        console.log('START GAME');
      },
      onGameReset: function (): void {
        console.log('RESET GAME');
      },
      onGameAbort: function (): void {
        console.log('ABORT GAME');
      },
      onGameDefeat: function (): void {
        console.log('LOST GAME');
      },
      onGameVictory: function (): void {
        console.log('WON GAME');
      }
    }
    const game: OngoingGame = {
      playerClient: client,
      playerName: client.data.user.username,
      gameInstance: createGameInstance(gameMode, gameSettings, handlingSettings, transitions, seed),
      spectatorClients: [client],
      queuedInputs: [],
      isProcessing: false,
    }
    ongoingGamesMap.set(client.id, game);
    this.server.to(spectatorRoomName).emit('updateSpectatorEntries', this.getSpectatorEntries());
  }

  @SubscribeMessage('queueUpGameInputs')
  queueUpGameInputs(client: Socket, gameInputs: InputFrame[]): void {
    const game = ongoingGamesMap.get(client.id)
    gameInputs.forEach(inputFrame => game.queuedInputs[inputFrame.indexID] = inputFrame);
    client.emit('queuedUpGameInputsReceivedAnswer', game.queuedInputs.length - 1);
    processGameInputs(game);

    function processGameInputs(game: OngoingGame): void {
      if (!game.isProcessing) {
        game.isProcessing = true;
        const queuedInputs = game.queuedInputs;
        const processedInputs = game.gameInstance.gameStateHistory.inputHistory;
        while (queuedInputs.length > processedInputs.length) {
          const inputFrame = queuedInputs[processedInputs.length];
          if (inputFrame.input === GAME_INPUT.SHOOT) {
            game.gameInstance.angle = inputFrame.angle;
            executeShot(game.gameInstance);
          } else if (inputFrame.input === GAME_INPUT.HOLD) {
            holdBubble(game.gameInstance);
          }
          processedInputs[inputFrame.indexID] = inputFrame;
        }
        updateSpectatorGameInstance(game)
        game.isProcessing = false;
      }
    }

    function updateSpectatorGameInstance(game: OngoingGame): void {
      for (const spectator of game.spectatorClients) {
        const dto: dto_GameInstance = {
          playerName: game.playerName,
          playerID: game.playerClient.id,
          gameInstance: game.gameInstance
        }
        spectator.emit('updateGameInstaceForSpectators', dto);
      }
    }
  }


  //Spectate
  @SubscribeMessage('joinSpectatorRoom')
  joinSpectatorRoom(client: Socket): void {
    client.join(spectatorRoomName);
    client.emit('updateSpectatorEntries', this.getSpectatorEntries());
  }

  @SubscribeMessage('leaveSpectatorRoom')
  leaveSpectatorRoom(client: Socket): void {
    client.leave(spectatorRoomName);
  }

  @SubscribeMessage('spectatePlayer')
  spectatePlayer(client: Socket, playerClientID: string) {
    const playerGame = ongoingGamesMap.get(playerClientID);
    playerGame.spectatorClients.push(client);
  }

  getSpectatorEntries(): dto_SpectationEntry[] {
    const spectationEntries: dto_SpectationEntry[] = [];
    for (const [key, value] of ongoingGamesMap.entries()) {
      const entry: dto_SpectationEntry = {
        playerName: value.playerName,
        clientID: value.playerClient.id,
        userID: value.playerClient.data.user.id,
        gameMode: value.gameInstance.gameMode,
        dig: (value.gameInstance.gameSettings.prefillBoard && value.gameInstance.gameSettings.refillBoard),
        precision: !value.gameInstance.gameSettings.clearFloatingBubbles,
      }
      spectationEntries.push(entry);
    }
    return spectationEntries;
    
  }

  //Debug
  @SubscribeMessage('getOngoingGames')
  logOngoingGames(client: Socket): void {
    console.log(ongoingGamesMap);
    client.emit('returnAllOngoingGames', ongoingGamesMap);
  }

  @SubscribeMessage('clearOngoingGames')
  clearOngoingGames(client: Socket): void {
    console.log('clearOngoingGames');
    ongoingGamesMap.clear();
  }
}


/*
a player can
  - setup a game
    - list player in specator view

  - queue up game inputs
    - update spectators

  - restart game
    - reset board for spectators
    - show countdown for specators??

  - win game
    - show win screen for spectators

  - lose game
    - show defeat screen for spectators

  - leave game
    - remove player from spectator view

  - disconnect
    - remove player from spectator view
*/