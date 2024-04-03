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
import { Match } from './network/i/game.network.i.match';
import { dto_VersusScreen } from './network/dto/game.network.dto.vs-screen';
import { defaultHandlingSettings } from './default-values/game.default-values.handling-settings';
import { GAME_MODE } from './settings/i/game.settings.e.game-modes';
import { rankedSettings } from './default-values/game.default-values.ranked-settings';
import { getNextSeed } from './logic/game.logic.random';
import { MatchmakingService } from 'src/matchmaking/matchmaking.service';
import { Inject, forwardRef } from '@nestjs/common';


/*
J: Join Room
L: Leave Room
I: Input Data
O: Output Data
DI: Debug Input
DO: Debug Output
*/


const O_RANKED_MATCH_FOUND = "output_rankedMatchFound";
const O_RANKED_SETUP_GAME_INSTANCE = "output_rankedSetupGameInstance";
const I_RANKED_MATCH_FOUND_CONFIRMATION = "input_rankedMatchFoundConfirmation";
const I_RANKED_SETUP_GAME_CONFIRMATION = "input_rankedSetupGameConfirmation";
const O_RANKED_START_GAME = "output_rankedStartGame";
const O_RANKED_SHOW_MATCH_SCORE = "output_rankedShowMatchScore";

const I_QUEUE_INPUTS = "input_queueUpGameInputs";
const O_QUEUE_INPUTS = "output_highestInputIndexReceived";

const I_SINGLEPLAYER_SETUP_GAME = "I_SINGLEPLAYER_SETUP_GAME";
const I_SINGLEPLAYER_COUNT_DOWN_STATE = "I_SINGLEPLAYER_COUNT_DOWN_STATE";
const I_SINGLEPLAYER_RESET_GAME = "I_SINGLEPLAYER_RESET_GAME";
const I_SINGLEPLAYER_LEAVE_GAME = "I_SINGLEPLAYER_LEAVE_GAME";

const J_SPECTATOR_ENTRIES = "join_spectatorEntriesRoom";
const L_SPECTATOR_ENTRIES = "leave_spectatorEntriesRoom";
const O_SPECTATOR_ENTRIES = "update_spectatorEntries";

const J_PLAYER_SPECTATOR = "join_playerSpectatorRoom";
const L_PLAYER_SPECTATOR = "leave_playerSpectatorRoom";
const O_PLAYER_SPECTATOR = "update_playerSpectator";

const DI_GET_ONGOING_GAMES = "debugInput_getAllOngoingGames";
const DO_GET_ONGOING_GAMES = "debugOutput_getAllOngoingGames";
const DI_CLEAR_ONGOING_GAMES = "debugInput_clearAllOngoingGames";

const SPECTATE_PREFIX = "spectate_";
const ENEMY_SPECTATE_PREFIX = "enemySpectate_";
const spectatorRoomName = 'spectatorRoom';
const ongoingRankedMatches: Map<string, Match> = new Map(); //<client.id + client2.id, RankedMatch
const ongoingSingeplayerGamesMap: Map<string, OngoingGame> = new Map(); //<client.id: string, OngoingGame>
@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => MatchmakingService))
    private matchmakingService: MatchmakingService,
  ) { }

  handleDisconnect(client: Socket) {
    const game = ongoingSingeplayerGamesMap.get(client.id);
    if (game) {
      game.gameInstance.gameState = GAME_STATE.DISCONNECTED;
      this.updatePlayerSpectator(game)
      ongoingSingeplayerGamesMap.delete(client.id);
      this.updateSpectatorEntries();
    }
  }

  // #region Ranked
  async setupRankedGame(player1: Socket, player2: Socket, player1ID: number, player2ID: number): Promise<void> {
    const vsScreenDTO: dto_VersusScreen = await this.matchmakingService.getVersusScreenDTO(player1ID, player2ID);
    const gameSetupDTO: dto_GameSetup = {
      gameMode: GAME_MODE.RANKED,
      gameSettings: rankedSettings,
      seed: getNextSeed(Date.now()),
    }
    const rankedMatchId = player1.id + player2.id;
    const rankedMatch: Match = {
      matchID: rankedMatchId,
      vsConfirmationMap: new Map(),
      setupConfirmationMap: new Map(),
      ongoingGamesMap: new Map(),
      scoresMap: new Map()
    }
    ongoingRankedMatches.set(rankedMatchId, rankedMatch);

    const players: Socket[] = [player1, player2];
    players.forEach(player => {
      console.log(player.data.user.username)
      rankedMatch.vsConfirmationMap.set(player.id, false);
      rankedMatch.setupConfirmationMap.set(player.id, false);
      rankedMatch.scoresMap.set(player.id, 0);

      const transitions: GameTransitions = {
        onGameDefeat: function (): void {
          const match = ongoingRankedMatches.get(rankedMatchId);
          match.ongoingGamesMap.get(player.id).gameInstance.gameState = GAME_STATE.DEFEAT_SCREEN;
          const playersAlive: string[] = []
          match.ongoingGamesMap.forEach((game, playerID) => {
            if (game.gameInstance.gameState !== GAME_STATE.DEFEAT_SCREEN) {
              playersAlive.push(playerID);
            }
          });
          if (playersAlive.length === 1) {
            const winnerID = playersAlive[0];
            match.ongoingGamesMap.get(winnerID).gameInstance.gameTransitions.onGameVictory();
          }
        }.bind(this),
        onGameVictory: function (): void {
          throw new Error('Function not implemented.');
        }.bind(this)
      };
      const instance = createGameInstance(GAME_MODE.RANKED, rankedSettings, defaultHandlingSettings, transitions, gameSetupDTO.seed);
      const game: OngoingGame = {
        playerClient: player,
        playerName: player.data.user.username,
        gameInstance: instance,
        enemySpectators: ENEMY_SPECTATE_PREFIX + player.id,
        playerSpectators: SPECTATE_PREFIX + player.id,
        queuedInputs: [],
        isProcessing: false,
      }
      rankedMatch.ongoingGamesMap.set(player.id, game);
      player.emit(O_RANKED_MATCH_FOUND, vsScreenDTO);
      player.emit(O_RANKED_SETUP_GAME_INSTANCE, gameSetupDTO);
    });
  }

  @SubscribeMessage(I_RANKED_MATCH_FOUND_CONFIRMATION)
  playerRankedMatchFoundConfirmation(client: Socket, matchID: string) {
    const match = ongoingRankedMatches.get(matchID);
    match.ongoingGamesMap.forEach((game, key) => {
      const gameSetupDTO: dto_GameSetup = {
        gameMode: GAME_MODE.RANKED,
        gameSettings: rankedSettings,
        seed: getNextSeed(Date.now()),
      }
      //game.playerClient.emit(O_SETUP_RANKED_GAME, gameSetupDTO);
    });
  }

/*   @SubscribeMessage(I_SETUP_RANKED_GAME_CONFIRMATION)
  playerSetupGameReadyConfirmation(client: Socket, matchID: string) {

  } */

  updateRankedScore(matchID: string, winnerID: string) {
    const match = ongoingRankedMatches.get(matchID);
    const score = match.scoresMap.get(winnerID);
    match.scoresMap.set(winnerID, score + 1);

  }
  // #endregion


  // #region Gameplay
  @SubscribeMessage(I_QUEUE_INPUTS)
  queueUpGameInputs(client: Socket, gameInputs: InputFrame[]): void {
    const game = ongoingSingeplayerGamesMap.get(client.id);
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
  // #endregion


  // #region Singleplayer
  @SubscribeMessage(I_SINGLEPLAYER_SETUP_GAME)
  setupSingleplayerGame(client: Socket, dto_GameSetup: dto_GameSetup): void {
    const gameMode = dto_GameSetup.gameMode;
    const gameSettings = dto_GameSetup.gameSettings;
    const handlingSettings = defaultHandlingSettings;
    const seed = dto_GameSetup.seed;
    const transitions: GameTransitions = {
      onGameDefeat: function (): void {
        const game = ongoingSingeplayerGamesMap.get(client.id);
        game.gameInstance.gameState = GAME_STATE.DEFEAT_SCREEN;
        this.updatePlayerSpectator(game);
        this.updateSpectatorEntries();
      }.bind(this),
      onGameVictory: function (): void {
        const game = ongoingSingeplayerGamesMap.get(client.id);
        game.gameInstance.gameState = GAME_STATE.VICTORY_SCREEN;
        this.updatePlayerSpectator(game);
        this.updateSpectatorEntries();
      }.bind(this)
    }
    const game: OngoingGame = {
      playerClient: client,
      playerName: client.data.user.username,
      gameInstance: createGameInstance(gameMode, gameSettings, handlingSettings, transitions, seed),
      enemySpectators: ENEMY_SPECTATE_PREFIX + client.id,
      playerSpectators: SPECTATE_PREFIX + client.id,
      queuedInputs: [],
      isProcessing: false,
    }
    ongoingSingeplayerGamesMap.set(client.id, game);
    this.updateSpectatorEntries();
  }

  @SubscribeMessage(I_SINGLEPLAYER_COUNT_DOWN_STATE)
  countDown(client: Socket, gameState: GAME_STATE): void {
    const game = ongoingSingeplayerGamesMap.get(client.id);
    game.gameInstance.gameState = gameState;
    this.updatePlayerSpectator(game);
  }

  @SubscribeMessage(I_SINGLEPLAYER_RESET_GAME)
  resetGame(client: Socket, seed: number): void {
    const game = ongoingSingeplayerGamesMap.get(client.id);
    game.isProcessing = false;
    game.queuedInputs = [];
    resetGameInstance(game.gameInstance, seed);
    this.updatePlayerSpectator(game);
  }

  @SubscribeMessage(I_SINGLEPLAYER_LEAVE_GAME)
  leaveGame(client: Socket): void {
    const game = ongoingSingeplayerGamesMap.get(client.id);
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
    const roomname = ongoingSingeplayerGamesMap.get(playerClientID).playerSpectators;
    client.join(roomname);
    client.emit(O_PLAYER_SPECTATOR, this.createGameInstanceDto(playerClientID));
  }

  updatePlayerSpectator(game: OngoingGame): void {
    this.server.to(game.playerSpectators).emit(O_PLAYER_SPECTATOR, this.createGameInstanceDto(game));
  }

  @SubscribeMessage(L_PLAYER_SPECTATOR)
  leavePlayerSpectator(client: Socket, playerClientID: string): void {
    const roomname = ongoingSingeplayerGamesMap.get(playerClientID).playerSpectators;
    client.leave(roomname);
  }
  // #endregion


  // #region Data
  createGameInstanceDto(input: string | OngoingGame): dto_GameInstance {
    let game: OngoingGame;
    if (typeof input === 'string') {
      game = ongoingSingeplayerGamesMap.get(input);
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
    for (const [key, value] of ongoingSingeplayerGamesMap.entries()) {
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
    console.log(DI_GET_ONGOING_GAMES, ongoingSingeplayerGamesMap);
    const allData: dto_GameInstance[] = []
    for (const [key, value] of ongoingSingeplayerGamesMap.entries()) {
      allData.push(this.createGameInstanceDto(value));
    }
    client.emit(DO_GET_ONGOING_GAMES, allData);
  }

  @SubscribeMessage(DI_CLEAR_ONGOING_GAMES)
  clearOngoingGames(): void {
    console.log(DI_CLEAR_ONGOING_GAMES);
    ongoingSingeplayerGamesMap.clear();
  }
  // #endregion
}