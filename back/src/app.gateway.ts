import { BadRequestException, forwardRef, Inject, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { User } from "src/user/entities/user.entity";
import { UserService } from "./user/user.service";
import { GatewayExceptionFilter } from "./app.exceptionFilter";

export let userList: Socket[] = [];

@UseFilters(new GatewayExceptionFilter())
@UsePipes(new ValidationPipe())
@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@Inject(forwardRef(() => UserService))	
		private readonly userService: UserService) {}

	@WebSocketServer()
	server: Server;

	async handleConnection(client: Socket, ...args: any[]) {
		try {
			await this.userService.SetStatus(client.handshake.auth.user, 'Online');
		  } catch (error) {
		  console.log(error);
		}
		userList.push(client);
		this.server.emit("UpdateSomeone", { idChange: client.handshake.auth.user.id, idChange2: 0  })
	}

	async handleDisconnect(client: any) {
		try {
			await this.userService.SetStatus(client.handshake.auth.user, 'Offline');
		  } catch (error) {
		  console.log(error);
		}
		userList.splice(userList.indexOf(client), 1);
		this.server.emit("UpdateSomeone", { idChange: client.handshake.auth.user.id, idChange2: 0  })
	}
}
