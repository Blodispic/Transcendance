import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { User } from "src/user/entities/user.entity";
import { UserService } from "./user/user.service";

export let userList: Socket[] = [];

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly userService: UserService) {}

	@WebSocketServer()
	server: Server;

	handleConnection(client: any, ...args: any[]) {
		userList.push(client);
		console.log("open windows");
		this.userService.SetStatus(client.handshake.auth.user, "online");
		this.server.emit("ChangeStatus", {status: "online", idChange: client.handshake.auth.user.id })

	}

	handleDisconnect(client: any) {
		userList.splice(userList.indexOf(client), 1);
		console.log("close windows");
		this.userService.SetStatus(client.handshake.auth.user, "Offline");
		console.log("close windows");
		this.server.emit("ChangeStatus", {status: "Offline", idChange: client.handshake.auth.user.id })
	}

	@SubscribeMessage("status")
	HandleStatus(@MessageBody() status: string, @ConnectedSocket() client: Socket)
	{
	  console.log("emit");
	  this.userService.SetStatus(client.handshake.auth.user, status);
	  console.log("emit");
	  this.server.emit("ChangeStatus", {status, idChange: client.handshake.auth.user.id })
	}
	
}