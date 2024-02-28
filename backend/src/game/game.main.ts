import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameInstance } from './i/game.i.game-instance';
import { nd_GameSetup } from './network/i/game.network.i.game-setup-data';

const ongoingGames: GameInstance[] = []
@WebSocketGateway()
export class GameGateway {

  @SubscribeMessage('setupGame')
  setupGame(client: Socket, nd_GameSetup: nd_GameSetup): void {
    //console.log(nd_GameSetup);
  }
}