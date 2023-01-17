import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.services";

export interface Move {
	left: boolean;
	right: boolean;
}

@WebSocketGateway({
	cors: { //Might remove it after merge since it's already in main.ts
		origin: '*',
	},
})
export class PongGateway implements OnGatewayConnection, OnGatewayInit {
	@WebSocketServer()
	server: Server;

	constructor(private gameService: GameService) {}

	afterInit(server: Server) {
		this.gameService.startGame(this.server);
	}

	handleConnection(client: any, ...args: any[]) {
		console.log("Connected");
	}

	@SubscribeMessage("Move1")
	HandleMove1(@MessageBody() input: any, @ConnectedSocket() client: Socket)
	{
		this.gameService.updateMove1(input);
	}

	@SubscribeMessage("Move2")
	HandleMove2(@MessageBody() input: any, @ConnectedSocket() client: Socket)
	{
		this.gameService.updateMove2(input);
	}
}