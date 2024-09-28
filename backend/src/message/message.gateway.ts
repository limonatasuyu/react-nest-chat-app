import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer() server: Server;

  groups = [];

  handleConnection(client: any) {
    client.id = uuidv4();
  }

  @SubscribeMessage('message')
  handleEvent(
    @MessageBody() message: { content: string; groupId: string },
    @ConnectedSocket() client: any /*Socket*/,
  ) {
    this.sendMessageToGroup({
      content: message.content,
      author: client.username,
      id: client.id,
      groupId: message.groupId,
    });
    return {
      type: 'message',
      content: message.content,
      author: client.username,
      groupId: message.groupId,
    };
  }

  @SubscribeMessage('set_username')
  handleUsernameChange(
    @MessageBody() data: string,
    @ConnectedSocket() client: any /*Socket*/,
  ) {
    client.username = data;
  }

  @SubscribeMessage('create_group')
  handleGroupCreation(@MessageBody() data: string) {
    const groupId = uuidv4();
    this.groups.push({ id: groupId, name: data });
    return { type: 'create_group', groupId, groupName: data };
  }

  @SubscribeMessage('join_random_group')
  handleJoinRandomGroup() {
    const groupName = this.groups[0].name;
    const groupId = this.groups[0].id;
    return { type: 'join_group', groupId, groupName };
  }

  @SubscribeMessage('join_group')
  handleJoinGroup(@MessageBody() data: string) {
    const existingGroup = this.groups.find((i) => i.id === data);
    if (!existingGroup) {
      return {
        type: 'group_not_found',
      };
    }
    return {
      type: 'join_group',
      groupId: existingGroup.id,
      groupName: existingGroup.name,
    };
  }

  sendMessageToGroup(data: {
    content: string;
    author: string;
    id: string;
    groupId: string;
  }) {
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.id !== data.id) {
        client.send(JSON.stringify({ ...data, id: undefined }));
      }
    });
  }
}
