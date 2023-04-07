import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/user/entities/user.entity';
import { GameService } from './game.service';
import { userList } from 'src/app.gateway';
import { UserService } from 'src/user/user.service';
import { BadRequestException, UnauthorizedException, UseFilters } from '@nestjs/common';
import { GatewayExceptionFilter } from 'src/app.exceptionFilter';

export interface Move {
	left: boolean;
	right: boolean;
}

@UseFilters(new GatewayExceptionFilter())
@WebSocketGateway({
	cors: { //Might remove it after merge since it's already in main.ts
		origin: '*',
	},
})

export class PongGateway implements OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	inviteList: number[];
	
	constructor(private gameService: GameService, private readonly userService: UserService) {
		this.inviteList = new Array<number>;
	}
	
	findByID(id: number)
	{
		let i = 0;
		while (i < userList.length)
		{
			if (userList[i].handshake.auth.user.id == id)
				return (userList[i].handshake.auth.user);
			i++;
		}
		return null;
	}

	isInInvite(id: number)
	{
		let i = 0;
		while (i < this.inviteList.length)
		{
			if (this.inviteList[i] == id)
				return true;
			i++;
		}
		return false;
	}

	removeInvite(id: number)
	{
		let i  = 0;
		while (i < this.inviteList.length)
		{
			if (this.inviteList[i] == id)
			{
				this.inviteList.splice(i, 1);
				return;
			}
			i++;
		}
	}

	handleDisconnect(client: Socket) {
		this.gameService.playerDisconnect(client.id);
		this.gameService.removeFromWaitingRoom(client.id);
	}

	@SubscribeMessage('addToWaitingRoom')
	async HandleAddToWaitingRoom(@ConnectedSocket() client: Socket) {
		if (this.isInInvite(client.handshake.auth.user.id) === true)
		{
			this.server.to(client.id).emit('WaitingRoomFailure', 'You are already in an invite, decline it or wait for an answer');
			return;
		}
		if (this.gameService.inGame(client.handshake.auth.user.id) == true)
		{
			this.server.to(client.id).emit('WaitingRoomFailure', 'You invited someone already in a game');
			return;
		}
		if (await this.gameService.addToWaitingRoom(client) == 1)
			this.server.to(client.id).emit('WaitingRoomFailure', 'You are already in the waitingRoom');
		else
		{
			this.server.to(client.id).emit('WaitingRoomSuccess');
			this.gameService.startGame(this.server);
		}
	}

	@SubscribeMessage('removeFromWaitingRoom')
	async HandleRemoveFromWaitingRoom(@ConnectedSocket() client: Socket) {
		if (this.gameService.removeFromWaitingRoom(client.id) == 1)
			this.server.to(client.id).emit('WaitingRoomFailure', 'You are not in the waiting room');
		else
		{
			this.server.to(client.id).emit('WaitingRoomSuccess', 'You\'ve been removed from the waiting room successfuly');
		}
	}

	@SubscribeMessage('spectateGame')
	async HandleSpectator(@MessageBody() playerId: number, @ConnectedSocket() client: Socket) {
		
		let i = 0;
		const player: User | null = await this.userService.getById(playerId);
		if (player === null)
			throw new BadRequestException('UserToSpectate not found');
		while (i < this.gameService.gameRoom.length && player) {
			if (this.gameService.gameRoom[i].gameState.player1.name === player.username
				|| this.gameService.gameRoom[i].gameState.player2.name === player.username) {
				this.gameService.gameRoom[i].addSpectator(client.id);
				const socketLocal = this.findSocketFromUser(client.handshake.auth.user);
				if (socketLocal != null)
					this.server.to(socketLocal.id).emit('SpectateStart', i + 1, 0);
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

	findSocketById(userId: number) {
		for (const iterator of userList) {
			if (iterator.handshake.auth.user.id === userId)
				return iterator;
		}
		return null;
	}

	@SubscribeMessage('createCustomGame')
	async HandleCustomGame(@MessageBody() payload: { scoreMax: string; user1: number, user2: number, extra: boolean }, @ConnectedSocket() client: Socket) {
		console.log("Full Payload = ", payload);
		const user1 = await this.userService.getById(payload.user1)
		const user2 = await this.userService.getById(payload.user2)
		
		if (!user2 || !user1) //One of the user doesn't exist
			throw new BadRequestException('One of the users doesn\'t exist');
		if (user1.id != client.handshake.auth.user.id) //Player 1 isn't the client who sent the invite
			throw new BadRequestException('Player1 isn\'t the inviting socket');
		if (user2.id === user1.id) //Player can't play with himself
			throw new BadRequestException('User can\'t play with himself');

		this.gameService.removeFromWaitingRoom(client.id); //If client is in waitingroom we remove him from waiting room
		if (this.isInInvite(user2.id) || this.isInInvite(user1.id)
			|| this.gameService.inGame(user1.id) == true
			|| this.gameService.inGame(user2.id) == true)
		{
			this.server.to(client.id).emit('WaitingRoomFailure', 'You or the person you\'re inviting is busy');
			return;
		}

		const socketInvite = this.findSocketById(user2.id);
		if (socketInvite != null)
		{
			this.server.to(socketInvite.id).emit('invitationInGame', { scoreMax: payload.scoreMax, user1:{id: user1.id, username: user1.username}, user2:{id: user2.id, username: user2.username}, extra: payload.extra });
			this.inviteList.push(user1.id);
			this.inviteList.push(user2.id);
			this.server.to(client.id).emit('CreateCustomOK', "invitation success");
			setTimeout(() => {
				if (user1.id)
					this.removeInvite(user1.id);
				if (user2.id)
					this.removeInvite(user2.id);
			  }, 11000);
		}
	}

	@SubscribeMessage('acceptCustomGame')
	async AcceptCustomGame(@MessageBody() payload: { scoreMax: string; user1: {id: number, username: String}, user2:{id: number, username: String}, extra: boolean }, @ConnectedSocket() client: Socket) {

		// const user1 = await this.userService.getById(payload.user1.id);
		// const user2 = await this.userService.getById(payload.user2.id);
		// console.log("Accept game les 2 user", user1?.username, user2?.username);
		// if (user2 === null || user1 === null)
		// {
		// 	throw new BadRequestException('User doesn\'t exist');
		// }

		if (this.isInInvite(payload.user2.id) == false || this.isInInvite(payload.user1.id) == false) //One of the players hasn't been invited
		{
			throw new BadRequestException('One of the users hasn\'t been invited');
		}

		// Remove both users from InviteList, the can now invite and be invited again
		if (payload.user1)
			this.removeInvite(payload.user1.id);
		if (payload.user2)
			this.removeInvite(payload.user2.id);
		this.gameService.removeFromWaitingRoom(client.id);

		let userSocket1: Socket | null = this.findSocketById(payload.user1.id)
		let userSocket2: Socket | null = this.findSocketById(payload.user2.id)

		if (!userSocket1 || !userSocket2)
			throw new BadRequestException('One of the users does\'nt have a socket (handleConnection is broken)');
		
		if (await this.userService.getStatus(payload.user1.id) != 'Online')
		{
			this.server.to(userSocket2.id).emit('GameCancelled', this.userService.getUsername(payload.user1.id));
			return;
		}
		if (await this.userService.getStatus(payload.user2.id) != 'Online')
		{
			this.server.to(userSocket1.id).emit('GameCancelled', this.userService.getUsername(payload.user2.id));
			return;
		}
		this.gameService.startCustomGame(this.server, userSocket1, userSocket2, payload.extra, parseInt(payload.scoreMax));
	}

	@SubscribeMessage('declineCustomGame')
	DeclineCustomGame(@MessageBody() payload: { scoreMax: string; user1: {id: number}, user2:{id: number, username: String}, extra: boolean }) {

		// Remove both users from InviteList, the can now invite and be invited again
		if (payload.user1.id)
			this.removeInvite(payload.user1.id);
		if (payload.user2.id)
			this.removeInvite(payload.user2.id);
		let socket = this.findSocketById(payload.user1.id);
		if (socket)
			this.server.to(socket.id).emit('GameDeclined', payload.user2.username);
		socket = this.findSocketById(payload.user2.id);
		if (socket)
			this.server.to(socket.id).emit('GameDeclined', 'You');
	}

	@SubscribeMessage('GameEnd')
	HandleEnd(@MessageBody() input: Move, @ConnectedSocket() client: Socket) {
		if (this.gameService.gameRoom.length > 0)
			this.gameService.EndGame(client.id, this.server);
	}

	@SubscribeMessage('PlayerLeft')
	HandlePlayerLeft(@MessageBody() input: Move, @ConnectedSocket() client: Socket) {
		this.gameService.playerDisconnect(client.id);
	}

	@SubscribeMessage('Move1')
	HandleMove1(@MessageBody() payload: { input: { left: boolean, right: boolean }, roomId: number }, @ConnectedSocket() client: Socket) {
		const input : Move = {left: payload.input.left, right: payload.input.right};	
		this.gameService.updateMove1(input, client.id, payload.roomId);
	}

	@SubscribeMessage('Move2')
	HandleMove2(@MessageBody() payload: { input: { left: boolean, right: boolean }, roomId: number }, @ConnectedSocket() client: Socket) {
		const input : Move = {left: payload.input.left, right: payload.input.right};
		this.gameService.updateMove2(input, client.id, payload.roomId);
	}
}
