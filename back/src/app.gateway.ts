import { BadRequestException, forwardRef, Inject, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user/user.service';
import { GatewayExceptionFilter } from './app.exceptionFilter';
import { ChannelService } from './chat/channel/channel.service';
import { Status } from './user/entities/user.entity';

export const userList: Socket[] = [];

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
		private readonly userService: UserService,

		@Inject(forwardRef(() => ChannelService))
		private readonly channelService: ChannelService,
	) { }

	@WebSocketServer()
	server: Server;

	async handleConnection(client: Socket): Promise<any> {
		try {
			client.handshake.auth.user = await this.userService.GetByAccessToken(client.handshake.auth.token);
			if (client.handshake.auth.user === null)
				throw new BadRequestException("No user with such token")
			await this.userService.SetStatus(client.handshake.auth.user, Status.Online);
		} catch (error) {
			return client.disconnect();
		}
		userList.push(client);
		const channels = await this.channelService.getUserChannel(client.handshake.auth.user.id);
		channels.forEach(channel => {
			client.join('chan' + channel.id);
		});

		this.server.to(client.id).emit("LoginValid");
		this.server.emit('UpdateSomeone', { idChange: client.handshake.auth.user.id, idChange2: 0 });
	}

	async handleDisconnect(client: Socket) {
		userList.splice(userList.indexOf(client), 1);
		try {
			await this.userService.SetStatus(client.handshake.auth.user, Status.Offline);
		} catch (error) {
			return;
		}
		this.server.emit('UpdateSomeone', { idChange: client.handshake.auth.user.id, idChange2: 0 });
	}
	
	findSocketById(userId: number): Socket | null {
		const foundSocket = userList.find(socket => socket.handshake.auth.user.id === userId);
		return foundSocket || null;
	}

	@SubscribeMessage('RequestSent')
	HandleRequestSent(@MessageBody() playerId: number) {
		const socket = this.findSocketById(playerId);
		if (socket != null && socket.id != null)
		{
    	    this.server.to(socket.id).emit('RequestSent');
		}
	}
	@SubscribeMessage('logout')
	async HandleLogout(client: Socket) {
		try {
			await this.userService.SetStatus(client.handshake.auth.user, Status.Offline);
			this.server.emit('UpdateSomeone', { idChange: client.handshake.auth.user.id, idChange2: 0 });
		} catch (error) {
			return;
		}
	}
	@SubscribeMessage('RequestAccepted')
	HandleRequestAccepted(@MessageBody() playerId: number) {
		const socket = this.findSocketById(playerId);
		if (socket != null && socket.id != null)
		{
    	    this.server.to(socket.id).emit('RequestAccepted');
		}
	}

	@SubscribeMessage('RequestDeclined')
	HandleRequestDeclined(@MessageBody() playerId: number) {
		const socket = this.findSocketById(playerId);
		if (socket != null && socket.id != null)
		{
    	    this.server.to(socket.id).emit('RequestDeclined');
		}
	}
}
