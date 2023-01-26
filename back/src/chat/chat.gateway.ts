import { BadRequestException } from "@nestjs/common";
import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { userInfo } from "os";
import { Server, Socket } from "socket.io";
import { AppService } from "src/app.service";
import { ChannelService } from "src/chat/channel/channel.service";
import { CreateChannelDto } from "./channel/dto/create-channel.dto";
import { Chat } from "./chat.entity";
import { JoinChannelDto } from "./dto/join-channel.dto";
import { LeaveChannelDto } from "./dto/leave-channel.dto";
import { MessageChannelDto } from "./dto/message-channel.dto";

@WebSocketGateway({
	cors: {
	  origin: '*',
	},
   })
export class ChatGateway
 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
 constructor(
  private channelService: ChannelService,
 ) {}
 
 
  @WebSocketServer() server: Server;
 
 @SubscribeMessage('sendMessage')
 async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<void> {
	console.log(data)
  // this.server.to(client.id).emit("cc", "bjr")
   this.server.emit('recMessage', data);
 }
 
@SubscribeMessage('sendMessageChannel')
async handleSendMessageChannel(@ConnectedSocket() client: Socket, @MessageBody() messageChannelDto: MessageChannelDto)/* : Promise<any> */ {
  const channel = await this.channelService.getById(messageChannelDto.chanid);
  if (channel == null)
    throw new BadRequestException();
  // channel.users.forEach(user => {
  //     this.server.to("user-" + user.id).emit("sendMessageChannel", messageChannelDto);
  // });
  this.server.to("chan" + messageChannelDto.chanid).emit("sendMessageChannel", messageChannelDto.message);

}

@SubscribeMessage('joinChannel')
async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() joinChannelDto: JoinChannelDto) {
  const channel = await this.channelService.getById(joinChannelDto.chanid);
  if (channel === null)
  {
    // const createChannelDto = { name: joinChannelDto.channame }
    this.channelService.create({ name: joinChannelDto.channame });
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
  //  console.log(`Disconnected: ${client.id}`);
   //Do stuffs
 }
 
 handleConnection(client: Socket, ...args: any[]) {
  // console.log("client id ", client.handshake.headers.authorization)
   console.log(`Connected ${client.id}`);
  //  const token = {
  //    id: client.handshake.headers.authorization
  //  }
  //  console.log("token.id :", token.id);
   
  //  client.join("user-" + token.id);
   //Do stuffs
 }
}