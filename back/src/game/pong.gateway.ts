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

	@SubscribeMessage("spectateGame")
	HandleSpectator(@MessageBody() player: User, @ConnectedSocket() client: Socket)
	{
		let i : number = 0;
		while (i < this.gameService.gameRoom.length)
		{
			if (this.gameService.gameRoom[i].gameState.player1.name === player.username
				|| this.gameService.gameRoom[i].gameState.player2.name === player.username)
			{
				this.gameService.gameRoom[i].addSpectator(client.id);
				this.server.to(client.id).emit("Spectate", i);
				return;
			}
			i++;
		}
	}

	@SubscribeMessage("createCustomGame")
	HandleCustomGame(@MessageBody() user1: User, user2: User, extra: boolean, scoreMax: number, @ConnectedSocket() client: Socket)
	{
		console.log("Add " + user1.username + " to custom game.");
		console.log("Add " + user2.username + " to custom game.");
		let userSocket1 : any = userList[0]; //By default both user are the first user of the list
		let userSocket2 : any = userList[0]; //By default both user are the first user of the list
		let i : number = 0;
		while (i < userList.length)
		{
			if (userList[i].handshake.auth.user.username === user1.username)
			{
				userSocket1 = userList[i];
			}
			i++;
		}
		i = 0;
		while (i < userList.length)
		{
			if (userList[i].handshake.auth.user.username === user2.username)
			{
				userSocket2 = userList[i];
			}
			i++;
		}
		this.gameService.startCustomGame(this.server, userSocket1, userSocket2, extra, scoreMax);
		
	}

	@SubscribeMessage("GameEnd")
	HandleEnd(@MessageBody() input:Move, @ConnectedSocket() client: Socket)
	{
		if (this.gameService.gameRoom.length > 0)
			this.gameService.EndGame(client.id);
	}

	@SubscribeMessage("PlayerLeft")
	HandlePlayerLeft(@MessageBody() input:Move, @ConnectedSocket() client: any)
	{
		console.log("playerLeft");
		this.gameService.playerDisconnect(client.id);
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
