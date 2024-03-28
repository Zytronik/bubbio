import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { dto_GameSetup } from './network/dto/game.network.dto.game-setup';
import { OngoingGame } from './network/i/game.network.i.ongoing-game';
import { createGameInstance, resetGameInstance } from './logic/game.logic.instance-creator';
import { GameTransitions } from './i/game.i.game-transitions';
import { InputFrame } from './i/game.i.game-state-history';
import { GAME_INPUT } from './network/dto/game.network.dto.game-input';
import { executeShot } from './logic/game.logic.shoot';
import { holdBubble } from './logic/game.logic.bubble-manager';
import { dto_GameInstance } from './network/dto/game.network.dto.game-instance';
import { dto_SpectationEntry } from './network/dto/game.network.dto.spectation-entry';
import { GAME_STATE } from './i/game.e.state';


/*
J: Join Room
L: Leave Room
I: Input Data
O: Output Data
DI: Debug Input
DO: Debug Output
*/
const J_SPECTATOR_ENTRIES = "join_spectatorEntriesRoom";
const L_SPECTATOR_ENTRIES = "leave_spectatorEntriesRoom";
const O_SPECTATOR_ENTRIES = "update_spectatorEntries";

const J_PLAYER_SPECTATOR = "join_playerSpectatorRoom";
const L_PLAYER_SPECTATOR = "leave_playerSpectatorRoom";
const O_PLAYER_SPECTATOR = "update_playerSpectator";

const I_SETUP_GAME = "input_setupGame";
const I_COUNT_DOWN_STATE = "input_countDownState";
const I_QUEUE_INPUTS = "input_queueUpGameInputs";
const I_RESET_GAME = "input_resetGame";
const I_LEAVE_GAME = "input_leaveGame";
const O_QUEUE_INPUTS = "output_highestInputIndexReceived";

const DI_GET_ONGOING_GAMES = "debugInput_getAllOngoingGames";
const DO_GET_ONGOING_GAMES = "debugOutput_getAllOngoingGames";
const DI_CLEAR_ONGOING_GAMES = "debugInput_clearAllOngoingGames";

const SPECTATE_PREFIX = "spectate_";
const spectatorRoomName = 'spectatorRoom';
const ongoingGamesMap: Map<string, OngoingGame> = new Map(); //<client.id: string, OngoingGame>
@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  handleDisconnect(client: Socket) {
    const game = ongoingGamesMap.get(client.id);
    if (game) {
      game.gameInstance.gameState = GAME_STATE.DISCONNECTED;
      this.updatePlayerSpectator(game)
      ongoingGamesMap.delete(client.id);
      this.updateSpectatorEntries();
    }
  }



  // #region Gameplay
  @SubscribeMessage(I_SETUP_GAME)
  setupGame(client: Socket, dto_GameSetup: dto_GameSetup): void {
    const gameMode = dto_GameSetup.gameMode;
    const gameSettings = dto_GameSetup.gameSettings;
    const handlingSettings = dto_GameSetup.handlingSettings;
    const seed = dto_GameSetup.seed;
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
        const game = ongoingGamesMap.get(client.id);
        game.gameInstance.gameState = GAME_STATE.DEFEAT_SCREEN;
        this.updatePlayerSpectator(game);
        this.updateSpectatorEntries();
      }.bind(this),
      onGameVictory: function (): void {
        const game = ongoingGamesMap.get(client.id);
        game.gameInstance.gameState = GAME_STATE.VICTORY_SCREEN;
        this.updatePlayerSpectator(game);
        this.updateSpectatorEntries();
      }.bind(this)
    }
    const game: OngoingGame = {
      playerClient: client,
      playerName: client.data.user.username,
      gameInstance: createGameInstance(gameMode, gameSettings, handlingSettings, transitions, seed),
      playerSpectators: SPECTATE_PREFIX + client.id,
      queuedInputs: [],
      isProcessing: false,
    }
    ongoingGamesMap.set(client.id, game);
    this.updateSpectatorEntries();
  }

  @SubscribeMessage(I_COUNT_DOWN_STATE)
  countDown(client: Socket, gameState: GAME_STATE): void {
    const game = ongoingGamesMap.get(client.id);
    game.gameInstance.gameState = gameState;
    this.updatePlayerSpectator(game);
  }

  @SubscribeMessage(I_QUEUE_INPUTS)
  queueUpGameInputs(client: Socket, gameInputs: InputFrame[]): void {
    const game = ongoingGamesMap.get(client.id);
    gameInputs.forEach(inputFrame => game.queuedInputs[inputFrame.indexID] = inputFrame);
    client.emit(O_QUEUE_INPUTS, game.queuedInputs.length);

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
        game.gameInstance.stats.gameDuration = inputFrame.frameTime;
      }
      this.updatePlayerSpectator(game)
      game.isProcessing = false;
    }
  }

  @SubscribeMessage(I_RESET_GAME)
  resetGame(client: Socket, seed: number): void {
    const game = ongoingGamesMap.get(client.id);
    game.isProcessing = false;
    game.queuedInputs = [];
    resetGameInstance(game.gameInstance, seed);
    this.updatePlayerSpectator(game);
  }

  @SubscribeMessage(I_LEAVE_GAME)
  leaveGame(client: Socket): void {
    const game = ongoingGamesMap.get(client.id);
    game.gameInstance.gameState = GAME_STATE.IS_IN_MENU;
    this.updatePlayerSpectator(game);
    this.updateSpectatorEntries();
  }
  // #endregion



  // #region Spectate
  @SubscribeMessage(J_SPECTATOR_ENTRIES)
  joinSpectatorRoom(client: Socket): void {
    client.join(spectatorRoomName);
    client.emit(O_SPECTATOR_ENTRIES, this.getSpectatorEntries());
  }

  updateSpectatorEntries(): void {
    this.server.to(spectatorRoomName).emit(O_SPECTATOR_ENTRIES, this.getSpectatorEntries());
  }

  @SubscribeMessage(L_SPECTATOR_ENTRIES)
  leaveSpectatorRoom(client: Socket): void {
    client.leave(spectatorRoomName);
  }

  @SubscribeMessage(J_PLAYER_SPECTATOR)
  joinPlayerSpectator(client: Socket, playerClientID: string) {
    const roomname = ongoingGamesMap.get(playerClientID).playerSpectators;
    client.join(roomname);
    client.emit(O_PLAYER_SPECTATOR, this.createGameInstanceDto(playerClientID));
  }

  updatePlayerSpectator(game: OngoingGame): void {
    this.server.to(game.playerSpectators).emit(O_PLAYER_SPECTATOR, this.createGameInstanceDto(game));
  }

  @SubscribeMessage(L_PLAYER_SPECTATOR)
  leavePlayerSpectator(client: Socket, playerClientID: string): void {
    const roomname = ongoingGamesMap.get(playerClientID).playerSpectators;
    client.leave(roomname);
  }
  // #endregion



  // #region Data
  createGameInstanceDto(input: string | OngoingGame): dto_GameInstance {
    let game: OngoingGame;
    if (typeof input === 'string') {
      game = ongoingGamesMap.get(input);
    } else {
      game = input;
    }
    const dto: dto_GameInstance = {
      playerName: game.playerName,
      playerID: game.playerClient.id,
      gameInstance: game.gameInstance,
    }
    return dto;
  }

  getSpectatorEntries(): dto_SpectationEntry[] {
    const spectationEntries: dto_SpectationEntry[] = [];
    for (const [key, value] of ongoingGamesMap.entries()) {
      const state = value.gameInstance.gameState;
      const ingame = (
        state === GAME_STATE.READY ||
        state === GAME_STATE.IN_GAME ||
        state === GAME_STATE.COUNTDOWN_GO ||
        state === GAME_STATE.COUNTDOWN_3 ||
        state === GAME_STATE.COUNTDOWN_2 ||
        state === GAME_STATE.COUNTDOWN_1
      );
      if (ingame) {
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
    }
    return spectationEntries;
  }
  // #endregion



  // #region Debug
  @SubscribeMessage(DI_GET_ONGOING_GAMES)
  logOngoingGames(client: Socket): void {
    console.log(DI_GET_ONGOING_GAMES, ongoingGamesMap);
    const allData: dto_GameInstance[] = []
    for (const [key, value] of ongoingGamesMap.entries()) {
      allData.push(this.createGameInstanceDto(value));
    }
    client.emit(DO_GET_ONGOING_GAMES, allData);
  }

  @SubscribeMessage(DI_CLEAR_ONGOING_GAMES)
  clearOngoingGames(): void {
    console.log(DI_CLEAR_ONGOING_GAMES);
    ongoingGamesMap.clear();
  }
  // #endregion
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