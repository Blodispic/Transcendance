import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { User } from "src/user/entities/user.entity";
import { GameService } from "./game.service";
import { userList } from "src/app.gateway";

export interface Move {
	left: boolean;
	right: boolean;
}

@WebSocketGateway({
	cors: { //Might remove it after merge since it's already in main.ts
		origin: '*',
	},
})
export class PongGateway implements OnGatewayDisconnect, OnGatewayInit {
	@WebSocketServer()
	server: Server;

	constructor(private gameService: GameService) {}

	afterInit(server: Server) {
		// this.gameService.startGame(this.server);
	}

	// handleConnection(client: any, ...args: any[]) {
	// 	console.log("Client: " + client.id + " Connected");
	// 	//Need to add user to userList
	// }

	handleDisconnect(client: any) {

		//Need to remove user from game and make the other player win
		this.gameService.playerDisconnect(client.id);
	}

	@SubscribeMessage("addToWaitingRoom")
	HandleAddToWaitingRoom(@MessageBody() user: User, @ConnectedSocket() client: Socket)
	{
		console.log("Add " + user.username + " to waiting room.");
		this.gameService.addToWaitingRoom(userList[userList.indexOf(client)] );
		this.gameService.startGame(this.server);
	}

	@SubscribeMessage("GameEnd")
	HandleEnd(@MessageBody() input: Move, @ConnectedSocket() client: Socket)
	{
		console.log(this.gameService.gameRoom.length);
		if (this.gameService.gameRoom.length > 0)
			this.gameService.EndGame(client.id);
	}

	@SubscribeMessage("Move1")
	HandleMove1(@MessageBody() input: Move, @ConnectedSocket() client: Socket)
	{
		this.gameService.updateMove1(input, client.id);
	}

	@SubscribeMessage("Move2")
	HandleMove2(@MessageBody() input: Move, @ConnectedSocket() client: Socket)
	{
		this.gameService.updateMove2(input, client.id);
	}
}
