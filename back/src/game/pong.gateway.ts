import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.services";

export interface Move {
	left: boolean;
	right: boolean;
}

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class PongGateway implements OnGatewayConnection, OnGatewayInit {

	@WebSocketServer()
	server: Server;

	constructor(private gameService: GameService) {}

	afterInit(server: Server) {
		console.log(" init")
		this.gameService.server = server;
		console.log("cc", this.gameService.server)
	}

	handleConnection(client: any, ...args: any[]) {
		console.log("Coucou");
	}
	@SubscribeMessage("InputKeyboard")
	HandleInput(@MessageBody() input: any, @ConnectedSocket() client: Socket)
	{
		this.server.emit("TrueInput", input);
	}
}