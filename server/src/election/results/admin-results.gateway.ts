import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/admin-results', cors: true })
export class AdminResultsGateway {
    
    @WebSocketServer()
    server: Server;

    emitAdminResults(results: any) {
        this.server.emit('adminVoteUpdate', results);
    }
}