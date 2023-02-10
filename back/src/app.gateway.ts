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
	}

	handleDisconnect(client: any) {
		userList.splice(userList.indexOf(client), 1);
	}

	@SubscribeMessage("status")
	HandleStatus(@MessageBody() status: string, @ConnectedSocket() client: Socket)
	{
		// Const user = await this.userRepository.findOneBy({where: id: id})
		this.userService.SetStatus(client.handshake.auth.user, status);
		//emit a tout le monde 
	}
}