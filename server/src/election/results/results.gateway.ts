import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ResultsGateway {
  @WebSocketServer()
  server: Server;

  emitResults(results: any) {
    this.server.emit('voteUpdate', results);
  }

}
