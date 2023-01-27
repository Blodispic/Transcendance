import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { User } from "src/user/entities/user.entity";

export let userList: Socket[] = [];

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	handleConnection(client: any, ...args: any[]) {
		console.log("Client: " + client.id + " Connected");
		userList.push(client);
	}

	handleDisconnect(client: any) {
		console.log("Client: " + client.id + " Disconnected");
		userList.splice(userList.indexOf(client), 1);
	}
}