import { OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]): void {
    console.log("nothing to do yet :)");
  }

  @SubscribeMessage('testma')
  handleMessage(client: any, payload: any): void {
    client.emit("testma", { th: "hello" });
    console.log(payload);
  }
}


// const POSSIBLE_COLORS = [0, 1, 2, 3, 4, 5, 6];
// let bubbleQueue = genereateBubbleQueue(100);

// function genereateBubbleQueue(queueLength) {
//     let resultQueue = "";
//     for (let i = 0; i < queueLength; i++) {
//         resultQueue += POSSIBLE_COLORS[Math.random(POSSIBLE_COLORS.length)];
//     }
//     /* console.log(resultQueue); */
//     return resultQueue;
// }