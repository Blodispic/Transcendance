import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
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
	constructor(private readonly userService: UserService) { }

	@WebSocketServer()
	server: Server;

	handleConnection(client: any, ...args: any[]) {
		userList.push(client);
		this.userService.SetStatus(client.handshake.auth.user, "Online");
		this.server.emit("UpdateSomeone", { idChange: client.handshake.auth.user.id, idChange2: 0  })
	}

	handleDisconnect(client: any) {
		userList.splice(userList.indexOf(client), 1);
		this.userService.SetStatus(client.handshake.auth.user, "Offline");
		this.server.emit("UpdateSomeone", { idChange: client.handshake.auth.user.id, idChange2: 0  })
	}
}