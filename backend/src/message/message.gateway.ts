import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow CORS if required for cross-origin WebSocket connections
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('WebsocketGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket gateway initialized');
  }

  handleConnection(client: WebSocket) {
    this.logger.log('Client connected');
    client.send('Welcome to WebSocket server');
  }

  handleDisconnect(client: WebSocket) {
    this.logger.log('Client disconnected');
  }

  sendMessageToAll(message: string) {
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
