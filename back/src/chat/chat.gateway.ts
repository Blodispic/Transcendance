import { BadRequestException } from "@nestjs/common";
import { WebSocketGateway, OnGatewayInit, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { userInfo } from "os";
import { Server, Socket } from "socket.io";
import { AppService } from "src/app.service";
import { ChannelService } from "src/chat/channel/channel.service";
import { user } from "src/game/game.controller";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { CreateChannelDto } from "./channel/dto/create-channel.dto";
import { Chat } from "./chat.entity";
import { ChatService } from "./chat.service";
import { JoinChannelDto } from "./dto/join-channel.dto";
import { LeaveChannelDto } from "./dto/leave-channel.dto";
import { MessageChannelDto } from "./dto/message-channel.dto";
import { MessageUserDto } from "./dto/message-user.dto";

@WebSocketGateway({
	cors: {
	  origin: '*',
	},
   })
export class ChatGateway
 implements OnGatewayInit, OnGatewayDisconnect
{
 constructor(
  private channelService: ChannelService,
  private userService: UserService,
 ) {}
 
 
  @WebSocketServer() server: Server;
 
 @SubscribeMessage('sendMessage')
 async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<void> {
	console.log(data)
  // this.server.to(client.id).emit("cc", "bjr")
   this.server.emit('recMessage', data);
 }
 
 @SubscribeMessage('sendMessageUser')
 async handleSendMessageUser(@ConnectedSocket() client: Socket, @MessageBody() messageUserDto: MessageUserDto)/* : Promise<any> */ {
   const user = await this.userService.getById(messageUserDto.useridtowho);
   if (user == null)
     throw new BadRequestException();
   // channel.users.forEach(user => {
   //     this.server.to("user-" + user.id).emit("sendMessageChannel", messageChannelDto);
   // });
  //  this.server.to(user.  "chan" + messageUserDto.chanid).emit("sendMessageUserOk", messageChannelDto.message);
 
  //voir une fois qu'on a un access-token

 }



@SubscribeMessage('sendMessageChannel')
async handleSendMessageChannel(@ConnectedSocket() client: Socket, @MessageBody() messageChannelDto: MessageChannelDto)/* : Promise<any> */ {
  const channel = await this.channelService.getById(messageChannelDto.chanid);
  if (channel == null)
    throw new BadRequestException();
  // channel.users.forEach(user => {
  //     this.server.to("user-" + user.id).emit("sendMessageChannel", messageChannelDto);
  // });
  this.server.to("chan" + messageChannelDto.chanid).emit("sendMessageChannelOK", messageChannelDto.message);

}

@SubscribeMessage('clickChat')
async handleCliclChat(@ConnectedSocket() client: Socket, @MessageBody() user: User){
    this.chatService.linkIdtoUser(client, user);
}

@SubscribeMessage('joinChannel')
async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() joinChannelDto: JoinChannelDto) {
  const channel = await this.channelService.getById(joinChannelDto.chanid);
  if (channel === null)
  {
    const user = await this.userService.getById(joinChannelDto.userid);
    if (user === null)
      throw new BadRequestException();
    const createChannelDto = { 
      name: joinChannelDto.channame,
      owner: user,
    }
    this.channelService.create(createChannelDto);
  }
  this.channelService.add( { userId: joinChannelDto.userid, chanId: joinChannelDto.chanid});
  client.join("chan" + joinChannelDto.chanid);
}

@SubscribeMessage('leaveChannel')
async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() leaveChannelDto: LeaveChannelDto) {
  const channel = await this.channelService.getById(leaveChannelDto.chanid);
  if (channel === null)
    throw new BadRequestException();
    this.channelService.rm( { userid: leaveChannelDto.userid, chanid: leaveChannelDto.chanid});
  client.leave("chan" + leaveChannelDto.chanid);
}

 afterInit(server: Server) {
//    console.log(server);
   //Do stuffs
 }
 
 handleDisconnect(client: Socket) {
   console.log(`Disconnected: ${client.id}`);


   //Do stuffs
 }
 
 handleConnection(client: Socket, ...args: any[]) {
  // console.log("client id ", client.handshake.headers.authorization)
   console.log(`Connected ${client.id}`);
   console.log(client.handshake);
   console.log(`Connecteddd ${client.id}`);
  //  const token = {
  //    id: client.
  //  }
  //  console.log("token.id :", token.id);
   
  //  client.join("user-" + token.id);
   //Do stuffs
 }
}