import { BadRequestException } from "@nestjs/common";
import { WebSocketGateway, OnGatewayInit, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { userInfo } from "os";
import { Server, Socket } from "socket.io";
import { AppService } from "src/app.service";
import { ChannelService } from "src/chat/channel/channel.service";
import { user } from "src/game/game.controller";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Chat } from "./chat.entity";
import { JoinChannelDto } from "./dto/join-channel.dto";
import { LeaveChannelDto } from "./dto/leave-channel.dto";
import { MessageChannelDto } from "./dto/message-channel.dto";
import { MessageUserDto } from "./dto/message-user.dto";
import { userList } from "src/app.gateway";
import { AppGateway } from "src/app.gateway";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { ChanPasswordDto } from "./dto/chan-password.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { MuteUserDto } from "./dto/mute-user.dto";
import { Channel } from "./channel/entities/channel.entity";
import { GiveAdminDto } from "./dto/give-admin.dto";
import { InviteDto } from "./dto/invite-user.dto";
var bcrypt = require('bcryptjs');

@WebSocketGateway({
	cors: {
	  origin: '*',
	},
   })
export class ChatGateway
{
 constructor(
  private channelService: ChannelService,
  private userService: UserService,
 ) {}
 
 
  @WebSocketServer() server: Server;
 
//  @SubscribeMessage('sendMessage')
//  async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<void> {

//   // this.server.to(client.id).emit("cc", "bjr")
//    this.server.emit('recMessage', data);
//  }
 
 @SubscribeMessage('sendMessageUser')
 async handleSendMessageUser(@ConnectedSocket() client: Socket, @MessageBody() messageUserDto: MessageUserDto)/* : Promise<any> */ {
  //  const user = await this.userService.getById(messageUserDto.useridtowho);
  const socketIdToWho = this.findSocketFromUser(messageUserDto.usertowho);
  if (socketIdToWho === null)
    throw new BadRequestException(); // no such user
  this.server.to(socketIdToWho.id).emit("sendMessageUserOK", messageUserDto);
 }

findSocketFromUser(user: User)
 {  
  for (const iterator of userList) {
    if (iterator.handshake.auth.user.id === user.id)
      return iterator;
  }
  return null;
 }


@SubscribeMessage('sendMessageChannel')
async handleSendMessageChannel(@ConnectedSocket() client: Socket, @MessageBody() messageChannelDto: MessageChannelDto)/* : Promise<any> */ {
  const channel = await this.channelService.getById(messageChannelDto.chanid);
  if (channel == null)
    throw new BadRequestException(); // no such channel
  const user = client.handshake.auth.user;
  if (!(await this.channelService.isUserinChan(channel, user)))
    throw new BadRequestException();
  if (await this.channelService.isUserMuted({chanid: channel.id, userid: user.id}) || 
  await this.channelService.isUserBanned({chanid: channel.id, userid: user.id }))
    throw new BadRequestException(); // user is ban or mute from this channel
  this.server.to("chan" + messageChannelDto.chanid).emit("sendMessageChannelOK", messageChannelDto);
}

@SubscribeMessage('joinChannel')
async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() joinChannelDto: JoinChannelDto) {    
  const channel = await this.channelService.getById(joinChannelDto.chanid);
  if (channel === null)
    throw new BadRequestException(); // no such channel
  const user = client.handshake.auth.user;
  // if (channel.password && channel.password != joinChannelDto.password) 
  if (channel.password && !(await bcrypt.compare(channel.password, joinChannelDto.password)))
    throw new BadRequestException(); // wrong password
  if (await this.channelService.isUserBanned({chanid: channel.id, userid: user.id}))
    throw new BadRequestException();
    this.channelService.add({
    user: client.handshake.auth.user,
    chanId: channel.id,
  });
  client.join("chan" + joinChannelDto.chanid);
  client.emit("joinChannelOK", channel);
  this.server.to("chan" + channel.id).emit("joinChannel", client.handshake.auth.user);
}

@SubscribeMessage('createChannel')
async handleCreateChannel(@ConnectedSocket() client: Socket, @MessageBody() createChannelDto: CreateChannelDto) {    
  const channel = await this.channelService.getByName(createChannelDto.chanName);
  
  if (channel != null)
    throw new BadRequestException(); //channame already exist, possible ? if private/protected possible ?

  let user: User = client.handshake.auth.user;
  const new_channel = await this.channelService.create(createChannelDto, user);
  this.channelService.add({
    user: user,
    chanId: new_channel.id,
  });
  client.join("chan" + new_channel.id);

  client.emit("createChannelOk", new_channel.id);
  // this.server.emit("reloadChannels"); // not sure for now
}

@SubscribeMessage('leaveChannel')
async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() leaveChannelDto: LeaveChannelDto) {
  const channel = await this.channelService.getById(leaveChannelDto.chanid);
  const user = client.handshake.auth.user;
  if (channel === null || user === null)
    throw new BadRequestException(); // no such channel/user, shouldn't happened
  this.channelService.rm( { user, chanid: leaveChannelDto.chanid});
  client.leave("chan" + leaveChannelDto.chanid);
  client.emit("leaveChannelOK", channel.id);
  this.server.to("chan" + channel.id).emit("leaveChannel", user);
}

@SubscribeMessage('addPassword')
async handleAddPassword(@ConnectedSocket() client: Socket, @MessageBody() chanPasswordDto: ChanPasswordDto) {
  const channel = await this.channelService.getById(chanPasswordDto.chanid);
  const user = client.handshake.auth.user;
  if (channel === null || user === null)
    throw new BadRequestException(); // no such channel or user
  if (!(await this.channelService.isUserAdmin(user))) // for now only the real owner/admin, soon any owner/admin
    throw new BadRequestException(); // user willing to change password isn't admin/owner
  this.channelService.update(channel.id, {
    password: chanPasswordDto.password,
    chanType: 2,
  });
  client.emit("addPasswordOK", channel.id);
}

@SubscribeMessage('rmPassword')
async handleRmPassword(@ConnectedSocket() client: Socket, @MessageBody() chanPasswordDto: ChanPasswordDto) {
  const channel = await this.channelService.getById(chanPasswordDto.chanid);
  const user = client.handshake.auth.user;
  if (channel === null || user === null)
    throw new BadRequestException(); // no such channel or user
  if (!(await this.channelService.isUserAdmin(user))) // for now only the real owner/admin, soon any owner/admin
    throw new BadRequestException(); // user willing to change password isn't admin/owner
  this.channelService.update(channel.id, {
    rmPassword: 1,
    chanType: 0,
  });
  client.emit("rmPasswordOK", channel.id);
  }

@SubscribeMessage('changePassword')
async handleChangePassword(@ConnectedSocket() client: Socket, @MessageBody() chanPasswordDto: ChanPasswordDto) {
  const channel = await this.channelService.getById(chanPasswordDto.chanid);
  const user = client.handshake.auth.user;
  if (channel === null || user === null)
    throw new BadRequestException(); // no such channel or user
  if (!(await this.channelService.isUserAdmin(user))) // for now only the real owner/admin, soon any owner/admin
    throw new BadRequestException(); // user willing to change password isn't admin/owner
  if (channel.password === null)
    throw new BadRequestException(); // chan doesn't already have password
  this.channelService.update(channel.id, {
    password: chanPasswordDto.password,
  });
  client.emit("changePasswordOK", channel.id);
  }

@SubscribeMessage('BanUser')
async handleBanUser(@ConnectedSocket() client: Socket, @MessageBody() banUserDto: BanUserDto) {
  const channel = await this.channelService.getById(banUserDto.chanid);
  const user = client.handshake.auth.user;
  if (channel === null || user === null)
    throw new BadRequestException(); // no such channel or user
  if (!(await this.channelService.isUserAdmin(user)))
    throw new BadRequestException();
  this.channelService.banUser(banUserDto);
  this.channelService.rm({user: user, chanid: channel.id});
  let timer = 60000;
  if (banUserDto.timeout)
    timer = banUserDto.timeout;
  setTimeout(() => {
    this.channelService.unmuteUser(user)
  }, timer);
  client.emit("banUserOK", user.id, channel.id);
}

@SubscribeMessage('MuteUser')
async handleMuteUser(@ConnectedSocket() client: Socket, @MessageBody() muteUserDto: MuteUserDto) {
  const channel = await this.channelService.getById(muteUserDto.chanid);
  const user = client.handshake.auth.user;
  if (channel === null || user === null)
    throw new BadRequestException(); // no such channel or user
  if (!(await this.channelService.isUserAdmin(user)))
    throw new BadRequestException();
  this.channelService.muteUser(muteUserDto);
  let timer = 60000;
  if (muteUserDto.timeout)
    timer = muteUserDto.timeout;
  setTimeout(() => {
    this.channelService.unmuteUser(user)
  }, timer);
  client.emit("muteUserOK", user.id, channel.id);
}

@SubscribeMessage('GiveAdmin')
async handleGiveAdmin(@ConnectedSocket() client: Socket, @MessageBody() giveAdminDto: GiveAdminDto) {
  const channel = await this.channelService.getById(giveAdminDto.chanid);
  const user = client.handshake.auth.user;
  if (channel === null || user === null)
    throw new BadRequestException(); // no such channel or user
  if (!(await this.channelService.isUserAdmin(user)))
    throw new BadRequestException();
  this.channelService.addAdmin(giveAdminDto);
  client.emit("giveAdminOK", user.id, channel.id);
}

@SubscribeMessage('Invite')
async handleInvite(@ConnectedSocket() client: Socket, @MessageBody() inviteDto: InviteDto)
{
  const channel = await this.channelService.getById(inviteDto.chanid);
  const user = client.handshake.auth.user;
  if (channel === null || user === null)
    throw new BadRequestException();
  if (!(await this.channelService.isUserAdmin(user)))
    throw new BadRequestException();
  const socketIdToWho = this.findSocketFromUser(inviteDto.user);
  if (socketIdToWho)
    this.server.to(socketIdToWho?.id).emit('invited', channel);
  client.emit('inviteOK');
}

 afterInit(server: Server) {

   //Do stuffs
 }
 
//  handleDisconnect(client: Socket) {

//  }
 

}
