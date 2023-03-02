import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { User } from "src/user/entities/user.entity";
import { GameService } from "./game.service";
import { userList } from "src/app.gateway";
import { UserService } from "src/user/user.service";
import { BadRequestException } from "@nestjs/common";

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
	userService: UserService;
	
	constructor(private gameService: GameService) { }
	
	afterInit(server: Server) {
	}
	
	findByID(id: number)
	{
		let i: number = 0;
		while (i < userList.length)
		{
			if (userList[i].handshake.auth.user.id === id)
				return (userList[i].handshake.auth.user);
			i++;
		}
		return null;
	}

	handleDisconnect(client: any) {
		this.gameService.playerDisconnect(client.id);
		this.gameService.removeFromWaitingRoom(client.id);
	}

	@SubscribeMessage("addToWaitingRoom")
	HandleAddToWaitingRoom(@MessageBody() user: User, @ConnectedSocket() client: Socket) {
		this.gameService.addToWaitingRoom(userList[userList.indexOf(client)]);
		this.gameService.startGame(this.server);
	}

	@SubscribeMessage("spectateGame")
	async HandleSpectator(@MessageBody() playerId: number, @ConnectedSocket() client: Socket) {
		let i: number = 0;
		// let player: User | null = await this.userService.getById(playerId);
		// let player = userList[userList.indexOf(playerId)].handshake.auth.user;
		let player = this.findByID(playerId);
		console.log(player.username);
		while (i < this.gameService.gameRoom.length && player) {
			if (this.gameService.gameRoom[i].gameState.player1.name === player.username
				|| this.gameService.gameRoom[i].gameState.player2.name === player.username) {
				this.gameService.gameRoom[i].addSpectator(client.id);
				const socketLocal = this.findSocketFromUser(client.handshake.auth.user);
				if (socketLocal != null)
					this.server.to(socketLocal.id).emit("SpectateStart", i + 1, 0);
				return;
			}
			i++;
		}
	}

	findSocketFromUser(user: User) {
		for (const iterator of userList) {
			if (iterator.handshake.auth.user.id === user.id)
				return iterator;
		}
		return null;
	}

	@SubscribeMessage("createCustomGame")
	HandleCustomGame(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		let user2: User = this.findByID(payload.user2);
		if (user2 === null)
			throw new BadRequestException("User2 doesn't exist");
		const socket = this.findSocketFromUser(user2);
		if (socket != null)
			this.server.to(socket.id).emit("invitationInGame", payload);
	}

	@SubscribeMessage("acceptCustomGame")
	AcceptCustomGame(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		let user1: User = this.findByID(payload.user1);
		let user2: User = this.findByID(payload.user2);
		if (user2 === null)
			throw new BadRequestException("User2 doesn't exist");
		console.log("Add " + user1.username + "and " + user2.username + " to custom game.");
		let userSocket1: any = userList[0]; //By default both user are the first user of the list
		let userSocket2: any = userList[0]; //By default both user are the first user of the list
		let i: number = 0;
		while (i < userList.length) {
			if (userList[i].handshake.auth.user.username === user1.username) {
				userSocket1 = userList[i];
				break;
			}
			i++;
		}
		i = 0;
		while (i < userList.length) {
			if (userList[i].handshake.auth.user.username === user2.username) {
				userSocket2 = userList[i];
				break;
			}
			i++;
		}
		this.gameService.startCustomGame(this.server, userSocket1, userSocket2, payload.extra, parseInt(payload.scoreMax));
	}

	@SubscribeMessage("GameEnd")
	HandleEnd(@MessageBody() input: Move, @ConnectedSocket() client: Socket) {
		if (this.gameService.gameRoom.length > 0)
			this.gameService.EndGame(client.id, this.server);
	}

	@SubscribeMessage("PlayerLeft")
	HandlePlayerLeft(@MessageBody() input: Move, @ConnectedSocket() client: any) {
		this.gameService.playerDisconnect(client.id);
	}

	@SubscribeMessage("Move1")
	HandleMove1(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		let input : Move = {left: payload.input.left, right: payload.input.right};	
		this.gameService.updateMove1(input, client.id, payload.roomId);
	}

	@SubscribeMessage("Move2")
	HandleMove2(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		let input : Move = {left: payload.input.left, right: payload.input.right};
		this.gameService.updateMove2(input, client.id, payload.roomId);
	}
}
