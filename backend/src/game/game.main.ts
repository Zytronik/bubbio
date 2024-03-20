import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { dto_GameSetup } from './network/dto/game.network.dto.game-setup';
import { OngoingGame } from './network/i/game.network.i.ongoing-game';
import { createGameInstance } from './logic/game.logic.instance-creator';
import { GameTransitions } from './i/game.i.game-transitions';
import { InputFrame } from './i/game.i.game-state-history';
import { GAME_INPUT } from './network/dto/game.network.dto.game-input';
import { executeShot } from './logic/game.logic.shoot';
import { holdBubble } from './logic/game.logic.bubble-manager';
import { dto_GameInstance } from './network/dto/game.network.dto.game-instance';

const ongoingGamesMap: Map<string, OngoingGame> = new Map();
@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {

  handleDisconnect(client: Socket) {
    const game = ongoingGamesMap.get(client.id);
    if (game) {
      ongoingGamesMap.delete(client.id);
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
  }

  @SubscribeMessage('queueUpGameInputs')
  queueUpGameInputs(client: Socket, gameInputs: InputFrame[]): void {
    const game = ongoingGamesMap.get(client.id)
    gameInputs.forEach(inputFrame => game.queuedInputs[inputFrame.indexID] = inputFrame);
    client.emit('queueUpGameInputsReceivedAnswer', game.queuedInputs.length - 1);
    this.processGameInputs(game);



    //check if what i am doing is right :^)
    const processedInputs = game.gameInstance.gameStateHistory.inputHistory;
    for (let i = 0; i < processedInputs.length; i++) {
      if (processedInputs[i].indexID != i) {
        console.error("something went wrong")
      }
    }
  }

  processGameInputs(game: OngoingGame): void {
    if (!game.isProcessing) {
      game.isProcessing = true;
      const queuedInputs = game.queuedInputs;
      const processedInputs = game.gameInstance.gameStateHistory.inputHistory;
      while (queuedInputs.length > processedInputs.length) {
        const inputFrame = queuedInputs[processedInputs.length];
        if (inputFrame.input === GAME_INPUT.SHOOT){
          game.gameInstance.angle = inputFrame.angle;
          executeShot(game.gameInstance);
        } else if (inputFrame.input === GAME_INPUT.HOLD) {
          holdBubble(game.gameInstance);
        }
        processedInputs[inputFrame.indexID] = inputFrame;
      }
      this.updateSpectatorGameInstance(game)
      game.isProcessing = false;
    }
  }

  updateSpectatorGameInstance(game: OngoingGame): void {
    for (const spectator of game.spectatorClients) {
      const dto: dto_GameInstance = {
        playerName: game.playerName,
        playerID: game.playerClient.id,
        gameInstance: game.gameInstance
      }
      spectator.emit('updateGameInstaceForSpectators', dto);
    }
  }

  @SubscribeMessage('logOngoingGames')
  logOngoingGames(client: Socket): void {
    console.log(ongoingGamesMap);
    client.emit('consoleLogAllOngoingGames', ongoingGamesMap.get(client.id));
  }

  @SubscribeMessage('clearOngoingGames')
  clearOngoingGames(client: Socket): void {
    console.log('clearOngoingGames');
    ongoingGamesMap.clear();
  }
}