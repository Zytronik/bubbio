import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { nd_GameSetup } from './network/i/game.network.i.game-setup-data';
import { GameInstance } from './i/game.i.game-instance';

const ongoingGames: GameInstance[] = []
@WebSocketGateway()
export class GameGateway {

  @SubscribeMessage('setupGame')
  setupGame(client: Socket, nd_GameSetup: nd_GameSetup): void {
    //console.log(nd_GameSetup);
  }
}