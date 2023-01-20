import { BadRequestException } from "@nestjs/common";
import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { userInfo } from "os";
import { Server, Socket } from "socket.io";
import { AppService } from "src/app.service";
import { ChannelService } from "src/channel/channel.service";
import { Chat } from "./chat.entity";
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
  channel.users.forEach(user => {
      this.server.to("user-" + user.id).emit("sendMessageChannel", messageChannelDto);
  });

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
  console.log("client id ", client.handshake.headers.authorization)
   console.log(`Connected ${client.id}`);
   const token = {
     id: client.handshake.headers.authorization
   }
   client.join("user-" + token.id);
   //Do stuffs
 }
}