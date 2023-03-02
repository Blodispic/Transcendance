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
import { Any } from "typeorm";
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
  
 @SubscribeMessage('sendMessageUser')
 async handleSendMessageUser(@ConnectedSocket() client: Socket, @MessageBody() messageUserDto: MessageUserDto)/* : Promise<any> */ {
  //  const user = await this.userService.getById(messageUserDto.useridtowho);
  const socketIdToWho = this.findSocketFromUser(messageUserDto.usertowho);
  if (socketIdToWho === null)
    throw new BadRequestException("No such user"); // no such user
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
    throw new BadRequestException("No such channel"); // no such channel
  const user = client.handshake.auth.user;
  if (!(await this.channelService.isUserinChan(channel, user)))
    throw new BadRequestException();
  if (await this.channelService.isUserMuted({chanid: channel.id, userid: user.id}) || 
  await this.channelService.isUserBanned({chanid: channel.id, userid: user.id })) // ban to remove soon
    throw new BadRequestException("you are muted for now on this channel"); // user is ban or mute from this channel
  this.server.to("chan" + messageChannelDto.chanid).emit("sendMessageChannelOK", messageChannelDto);
}

@SubscribeMessage('joinChannel')
async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() joinChannelDto: JoinChannelDto) {    
  const channel = await this.channelService.getById(joinChannelDto.chanid);
  if (channel === null)
    throw new BadRequestException("No such Channel"); // no such channel
  const user = await this.userService.getById(client.handshake.auth.user.id);
  if (user === null)
    throw new BadRequestException("No such user");  
  if (channel.password && !(await bcrypt.compare(joinChannelDto.password, channel.password)))
    throw new BadRequestException("Bad password"); // wrong password
  if (await this.channelService.isUserBanned({chanid: channel.id, userid: user.id}))
    throw new BadRequestException("You are banned from this channel");
  this.channelService.add({
    user: user,
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
    throw new BadRequestException("An existing channel already have this name"); //channame already exist, possible ? if private/protected possible ?

  const user = await this.userService.getById(client.handshake.auth.user.id);
  if (user === null)
    throw new BadRequestException("No such user");
  const new_channel = await this.channelService.create(createChannelDto, user);
  client.join("chan" + new_channel.id);
  if (new_channel.chanType == 1 && createChannelDto.users)
    this.inviteToChan(createChannelDto.users, new_channel.id);
  client.emit("createChannelOk", new_channel.id);
}

@SubscribeMessage('leaveChannel')
async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() leaveChannelDto: LeaveChannelDto) {
  const channel = await this.channelService.getById(leaveChannelDto.chanid);
  const user = client.handshake.auth.user;
  if (channel === null || user === null)
    throw new BadRequestException("No such Channel or User"); // no such channel/user, shouldn't happened
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
    throw new BadRequestException("No such Channel or User"); // no such channel or user
  if (!(await this.channelService.isUserAdmin(user))) // for now only the real owner/admin, soon any owner/admin
    throw new BadRequestException("you are not Admin on this channel"); // user willing to change password isn't admin/owner
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
    throw new BadRequestException("No such Channel or User"); // no such channel or user
  if (!(await this.channelService.isUserAdmin(user))) // for now only the real owner/admin, soon any owner/admin
    throw new BadRequestException("You are not Admin on this Channel"); // user willing to change password isn't admin/owner
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
    throw new BadRequestException("No such Channel or User"); // no such channel or user
  if (!(await this.channelService.isUserAdmin(user))) // for now only the real owner/admin, soon any owner/admin
    throw new BadRequestException("You are not Admin on this Channel"); // user willing to change password isn't admin/owner
  if (channel.password === null)
    throw new BadRequestException("Channel does not already have a password"); // chan doesn't already have password
  this.channelService.update(channel.id, {
    password: chanPasswordDto.password,
    chanType: 2,
  });
  client.emit("changePasswordOK", channel.id);
  }

@SubscribeMessage('BanUser')
async handleBanUser(@ConnectedSocket() client: Socket, @MessageBody() banUserDto: BanUserDto) {
  const channel = await this.channelService.getById(banUserDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  const userBan = await this.userService.getById(banUserDto.userid);
  if (channel === null || user === null || userBan === null)
    throw new BadRequestException("No such Channel or User"); // no such channel or user
  if (!(await this.channelService.isUserAdmin({chanid: channel.id, userid: user.id})))
    throw new BadRequestException("You are not Admin on this Channel");
  this.channelService.banUser(banUserDto);
  this.channelService.rm({user: userBan, chanid: channel.id});
  client.leave("chan" + channel.id);  
  let timer = 60000;
  if (banUserDto.timeout)
    timer = banUserDto.timeout;
  setTimeout(() => {
    this.channelService.unbanUser(banUserDto)
  }, timer);
  client.emit("banUserOK", user.id, channel.id);
}

@SubscribeMessage('MuteUser')
async handleMuteUser(@ConnectedSocket() client: Socket, @MessageBody() muteUserDto: MuteUserDto) {
  const channel = await this.channelService.getById(muteUserDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  if (channel === null || user === null)
    throw new BadRequestException("No such Channel or User"); // no such channel or user
  if (!(await this.channelService.isUserAdmin({chanid: channel.id, userid: user.id})))
    throw new BadRequestException("You are not Admin on this channel");
  await this.channelService.muteUser(muteUserDto);  
  let timer = 30000;
  if (muteUserDto.timeout)
    timer = muteUserDto.timeout;
  setTimeout(() => {
    
    this.channelService.unmuteUser(muteUserDto)
  }, timer);
  client.emit("muteUserOK", user.id, channel.id);
}

@SubscribeMessage('GiveAdmin')
async handleGiveAdmin(@ConnectedSocket() client: Socket, @MessageBody() giveAdminDto: GiveAdminDto) {
  const channel = await this.channelService.getById(giveAdminDto.chanid);
  const user = client.handshake.auth.user;
  if (channel === null || user === null)
    throw new BadRequestException("No such channel or User"); // no such channel or user
  if (!(await this.channelService.isUserAdmin(user)))
    throw new BadRequestException("You are not Admin on this channel");
  this.channelService.addAdmin(giveAdminDto);
  client.emit("giveAdminOK", user.id, channel.id);
}

@SubscribeMessage('Invite')
async handleInvite(@ConnectedSocket() client: Socket, @MessageBody() inviteDto: InviteDto)
{
  const channel = await this.channelService.getById(inviteDto.chanid);
  const user = client.handshake.auth.user;
  if (channel === null || user === null)
    throw new BadRequestException("No such Channel or User");
  if (!(await this.channelService.isUserAdmin(user)))
    throw new BadRequestException("You are not Admin on this channel");
  const socketIdToWho = this.findSocketFromUser(inviteDto.user);
  if (socketIdToWho)
    this.server.to(socketIdToWho.id).emit('invited', channel);
  socketIdToWho?.join("chan" + channel.id);
  this.channelService.add({user: inviteDto.user, chanId: inviteDto.chanid});
  client.emit('inviteOK');
}

async inviteToChan(users: User[], chanid: number)
{
  users.forEach(user => {
    let socketIdToWho = this.findSocketFromUser(user);
    if (socketIdToWho)
      this.server.to(socketIdToWho.id).emit("invited", chanid);
    socketIdToWho?.join("chan" + chanid);
    this.channelService.add({user: user, chanId: chanid});
  });
}

 afterInit(server: Server) {

   //Do stuffs
 }
 
//  handleDisconnect(client: Socket) {

//  }
 

}
