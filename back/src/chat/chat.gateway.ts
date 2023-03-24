import { BadRequestException } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChannelService } from "src/chat/channel/channel.service";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { JoinChannelDto } from "./dto/join-channel.dto";
import { LeaveChannelDto } from "./dto/leave-channel.dto";
import { SendDmDto } from "./dto/send-dm.dto";
import { userList } from "src/app.gateway";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { ChanPasswordDto } from "./dto/chan-password.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { MuteUserDto } from "./dto/mute-user.dto";
import { GiveAdminDto } from "./dto/give-admin.dto";
import { InviteDto } from "./dto/invite-user.dto";
import { SendMessageChannelDto } from "./dto/send-message-channel.dto";
const bcrypt = require('bcryptjs');

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
  
 @SubscribeMessage('sendDM')
 async handleSendMessageUser(@ConnectedSocket() client: Socket, @MessageBody() sendDmDto: SendDmDto)/* : Promise<any> */ {
   console.log("ok", sendDmDto);
  const receiver = await this.userService.getById(sendDmDto.IdReceiver);
  
  const sender = await this.userService.getById(client.handshake.auth.user.id);
  if (!receiver)
    throw new BadRequestException("Receiver does not exist");
  const socketReceiver = this.findSocketFromUser(receiver);
  if (socketReceiver === null)
    throw new BadRequestException("Receiver is not connected");

  client.emit("sendDmOK", sendDmDto); // added by selee
  this.server.to(socketReceiver.id).emit("ReceiveDM", {
    sender: sender,
    message: sendDmDto.message,
    sendtime: sendDmDto.sendtime, //added by selee
  });
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
async handleSendMessageChannel(@ConnectedSocket() client: Socket, @MessageBody() sendmessageChannelDto: SendMessageChannelDto)/* : Promise<any> */ {
  const channel = await this.channelService.getById(sendmessageChannelDto.chanid);
  if (channel == null)
    throw new BadRequestException("No such channel");
  const sender = await this.userService.getById(client.handshake.auth.user.id);
  if (sender == null)
    throw new BadRequestException("No such user");
  if (!(await this.channelService.isUserinChan(channel, sender)))
    throw new BadRequestException("You are not in this Channel");
  if (await this.channelService.isUserMuted({chanid: channel.id, userid: sender.id}) || 
  await this.channelService.isUserBanned({chanid: channel.id, userid: sender.id })) // ban to remove soon
    throw new BadRequestException("you are muted for now on this channel"); // user is ban or mute from this channel
  
  this.server.to("chan" + sendmessageChannelDto.chanid).emit("sendMessageChannelOK", {
    chanid: channel.id,
    sender: sender,
    message: sendmessageChannelDto.message,
    sendtime: sendmessageChannelDto.sendtime,
  });
}

@SubscribeMessage('joinChannel')
async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() joinChannelDto: JoinChannelDto) {    
  const channel = await this.channelService.getById(joinChannelDto.chanid);
  if (channel === null)
    throw new BadRequestException("No such Channel");
  
  const user = await this.userService.getById(client.handshake.auth.user.id);
  const pw = await this.channelService.getPwById(channel.id);  
  if (user === null)
  {
    client.emit("joinChannelFailed", "Invalid User"); 
    throw new BadRequestException("No such user");
  }
  if (channel.chanType == 2 && !(await bcrypt.compare(joinChannelDto.password, pw)))
  {
    client.emit("joinChannelFailed", "Wrong password");
    throw new BadRequestException("Bad password");
  }
  if (await this.channelService.isUserBanned({chanid: channel.id, userid: user.id}))
  {
    client.emit("joinChannelFailed", "You are banned from this channel");
    throw new BadRequestException("You are banned from this channel");
  }
  this.channelService.add({
    user: user,
    chanId: channel.id,
  });
  client.join("chan" + joinChannelDto.chanid);
  // client.emit("joinChannelOK", channel); //original
  client.emit("joinChannelOK", channel.id); // + (maybe) list of members
  this.server.to("chan" + channel.id).emit("joinChannel", {chanid: channel.id, user: user,});
}

@SubscribeMessage('createChannel')
async handleCreateChannel(@ConnectedSocket() client: Socket, @MessageBody() createChannelDto: CreateChannelDto) {
  const channel = await this.channelService.getByName(createChannelDto.chanName);

  if (channel != null) {
    client.emit("createChannelFailed", "An existing channel already have this name");
    throw new BadRequestException("An existing channel already have this name"); //channame already exist, possible ? if private/protected possible ?
  }
  const user = await this.userService.getById(client.handshake.auth.user.id);
  if (user === null)
    throw new BadRequestException("No such user");

  const new_channel = await this.channelService.create(createChannelDto, user);
  client.join("chan" + new_channel.id);
  if (new_channel.chanType == 1 && createChannelDto.users && createChannelDto.users.length > 0)
    this.inviteToChan(createChannelDto.users, new_channel.id);

  // client.emit("createChannelOk", new_channel.id);
  // client.emit("joinChannelOK", new_channel.id);

  this.server.emit("createChannelOk", new_channel.id);
}

@SubscribeMessage('leaveChannel')
async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() leaveChannelDto: LeaveChannelDto) {
  const channel = await this.channelService.getById(leaveChannelDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  if (channel === null || user === null)
  {
    client.emit("leaveChannelFailed", "Invalid User or Channel"); 
    throw new BadRequestException("No such Channel or User"); // no such channel/user, shouldn't happened
  }
  this.channelService.rm( { user, chanid: leaveChannelDto.chanid});
  client.leave("chan" + leaveChannelDto.chanid);
  client.emit("leaveChannelOK", channel.id);
  this.server.to("chan" + channel.id).emit("leaveChannel", {chanid: channel.id, user: user,});
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
  // client.emit("addPasswordOK", channel.id);
  this.server.emit("addPasswordOK", channel.id); //selee
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
  // client.emit("rmPasswordOK", channel.id);
  this.server.emit("rmPasswordOK", channel.id); //selee
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
  if (channel.owner?.id != user.id && await this.channelService.isUserAdmin({chanid: channel.id, userid: userBan.id}))
    throw new BadRequestException("You can not Ban an Admin")
  this.channelService.banUser(banUserDto);
  this.channelService.rm({user: userBan, chanid: channel.id});
  this.findSocketFromUser(userBan)?.leave("chan" + channel.id);
  let timer = 30000;
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
  const userMute = await this.userService.getById(muteUserDto.userid);
  if (channel === null || user === null || userMute === null)
    throw new BadRequestException("No such Channel or User"); // no such channel or user
  if (!(await this.channelService.isUserAdmin({chanid: channel.id, userid: user.id})))
    throw new BadRequestException("You are not Admin on this channel");
  if (channel.owner?.id != user.id && await this.channelService.isUserAdmin({chanid: channel.id, userid: userMute.id}))
    throw new BadRequestException("You can not Ban an Admin")
  this.channelService.muteUser(muteUserDto);  
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
    const socketIdToWho = this.findSocketFromUser(user);
    if (socketIdToWho)
      this.server.to(socketIdToWho.id).emit("invited", chanid);
    socketIdToWho?.join("chan" + chanid);
    this.channelService.add({user: user, chanId: chanid});
  });  
}

afterInit(server: Server) {
  console.log(`WebSocket server initialized: ${server}`);
}
 
//  handleDisconnect(client: Socket) {

//  }
 

}
