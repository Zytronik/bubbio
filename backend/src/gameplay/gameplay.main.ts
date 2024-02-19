import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GAME_MODE } from './i/gameplay.i.stats';
import { GameInstance } from './i/gameplay.i.game-instance';

const ongoingGames: GameInstance[] = []

@WebSocketGateway()
export class GameGateway {


  @SubscribeMessage('setupGame')
  setupGame(client: Socket, gameMode: GAME_MODE): void {
    console.log(gameMode);
    let playGrid = 100;
    client.id
  }

  
  @SubscribeMessage('shootAtAngle')
  shootAtAngle(client: Socket, angle: number): void {
    client.id
  }
}