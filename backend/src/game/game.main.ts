import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GAME_MODE } from './settings/i/game.settings.i.game-modes';
import { GameInstance } from './i/game.i.game-instance';
import { GameSettings } from './settings/i/game.settings.i.game-settings';
import { HandlingSettings } from './settings/i/game.settings.i.handling-settings';

const ongoingGames: GameInstance[] = []
@WebSocketGateway()
export class GameGateway {

  @SubscribeMessage('setupGame')
  setupGame(client: Socket, gameMode: GAME_MODE, gameSettings: GameSettings, handlingSettings: HandlingSettings): void {
    console.log(client);
    console.log(gameMode);
    console.log(gameSettings);
    console.log(handlingSettings);
  }
}