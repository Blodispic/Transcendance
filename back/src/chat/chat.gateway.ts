import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelService } from 'src/chat/channel/channel.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JoinChannelDto } from './dto/join-channel.dto';
import { LeaveChannelDto } from './dto/leave-channel.dto';
import { SendDmDto } from './dto/send-dm.dto';
import { userList } from 'src/app.gateway';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChanPasswordDto } from './dto/chan-password.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { MuteUserDto } from './dto/mute-user.dto';
import { GiveAdminDto } from './dto/give-admin.dto';
import { InviteDto } from './dto/invite-user.dto';
import { SendMessageChannelDto } from './dto/send-message-channel.dto';
import { GatewayExceptionFilter } from 'src/app.exceptionFilter';
const bcrypt = require('bcryptjs');

@UseFilters(new GatewayExceptionFilter())
@UsePipes(new ValidationPipe())
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
 async handleSendMessageUser(@ConnectedSocket() client: Socket, @MessageBody() sendDmDto: SendDmDto) {
  const receiver = await this.userService.getById(sendDmDto.IdReceiver);  
  const sender = await this.userService.getById(client.handshake.auth.user.id);
  if (!receiver)
    return; //Receiver does not exist');
  if (!sender)
    return; //Sender does not exist');
  const socketReceiver = this.findSocketFromUser(receiver);
  if (socketReceiver === null) 
  {
    client.emit('sendDMFailed', 'This user is offline');
    return; //Receiver is not connected');
  }
  if ((await this.userService.checkRelations(receiver.id, sender.id)).relation === 'Blocked')
    return; //User blocked');
  const sendtime = new Date().toLocaleString('en-US', { hourCycle: "h24", timeZone: "Europe/Paris" });
  client.emit('sendDmOK', {sendDmDto: sendDmDto, sender: sender, sendtime: sendtime});
  if ((await this.userService.checkRelations(sender.id, receiver.id)).relation === 'Blocked')
  return; //User blocked');
  this.server.to(socketReceiver.id).emit('ReceiveDM', {
    sender: sender,
    message: sendDmDto.message,
    sendtime: sendtime
  });
 }

findSocketFromUser(user: User): Socket | null
 {  
  for (const iterator of userList) {
    if (iterator.handshake.auth.user.id == user.id)
      return iterator;
  }
  return null;
 }


@SubscribeMessage('sendMessageChannel')
async handleSendMessageChannel(@ConnectedSocket() client: Socket, @MessageBody() sendmessageChannelDto: SendMessageChannelDto)/* : Promise<any> */ {
  const channel = await this.channelService.getById(sendmessageChannelDto.chanid);
  if (channel == null) {
    client.emit('sendMessageChannelFailed', 'No such channel');
    return;
  }
  const sender = await this.userService.getById(client.handshake.auth.user.id);
  if (sender == null) {
    client.emit('sendMessageChannelFailed', 'No such user');
    return;
  }
  if (!(await this.channelService.isUserinChan(channel, sender))) {
    client.emit('sendMessageChannelFailed', 'You are not in this channel');
    return;
  }
  if (await this.channelService.isUserMuted({chanid: channel.id, userid: sender.id})) {
    client.emit('sendMessageChannelFailed', 'You are muted or banned on this channel');
    return;
  }
  this.server.to('chan' + sendmessageChannelDto.chanid).emit('sendMessageChannelOK', {
    chanid: channel.id,
    sender: sender,
    message: sendmessageChannelDto.message,
    sendtime: new Date().toLocaleString('en-US', { hourCycle: "h24", timeZone: "Europe/Paris" }),
  });
}

@SubscribeMessage('joinChannel')
async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() joinChannelDto: JoinChannelDto) {    
  const channel = await this.channelService.getById(joinChannelDto.chanid);
  if (channel === null) {
    client.emit('joinChannelFailed', 'No such Channel'); 
    return;
  }
  const user = await this.userService.getById(client.handshake.auth.user.id);
  const pw = await this.channelService.getPwById(channel.id);  
  if (user === null)
  {
    client.emit('joinChannelFailed', 'Invalid User'); 
    return;
  }
  if (channel.chanType === 2 && !(await bcrypt.compare(joinChannelDto.password, pw)))
  {
    client.emit('joinChannelFailed', 'Wrong password');
    return;
  }
  if (await this.channelService.isUserBanned({chanid: channel.id, userid: user.id}))
  {
    client.emit('joinChannelFailed', 'You are banned from this channel');
    return;
  }
  await this.channelService.add({
    user: user,
    chanId: channel.id,
  });
  client.join('chan' + joinChannelDto.chanid);
  client.emit('joinChannelOK', channel.id);
  this.server.to('chan' + channel.id).emit('joinChannel', {chanid: channel.id, user: user});
}

@SubscribeMessage('createChannel')
async handleCreateChannel(@ConnectedSocket() client: Socket, @MessageBody() createChannelDto: CreateChannelDto) {
  createChannelDto.chanName = createChannelDto.chanName.trim();
  const channel = await this.channelService.getByName(createChannelDto.chanName);  
  if (channel != null) {
    client.emit('createChannelFailed', 'Channel name already exists');
    return;
  }
  if (createChannelDto.chanType == 2 && !createChannelDto.password) {
    client.emit("createChannelFailed", "Password needed");
    return;
  }
  const user = await this.userService.getById(client.handshake.auth.user.id);
  if (user === null) {
    client.emit('createChannelFailed', 'No such user')
    return;
  }
  const new_channel = await this.channelService.create(createChannelDto, user);
  client.join('chan' + new_channel.id);
  if (new_channel.chanType == 1 && createChannelDto.usersId && createChannelDto.usersId.length > 0)
    await this.inviteToChan(createChannelDto.usersId, new_channel.id);
  this.server.emit("createChannelOk", new_channel.id);
}

@SubscribeMessage('leaveChannel')
async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() leaveChannelDto: LeaveChannelDto) {
  const channel = await this.channelService.getById(leaveChannelDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  if (channel === null || user === null)
  {
    client.emit('leaveChannelFailed', 'Invalid User or Channel'); 
    return;
  }
  this.channelService.rm( { user, chanid: leaveChannelDto.chanid});
  client.leave('chan' + leaveChannelDto.chanid);
  client.emit('leaveChannelOK', channel.id);
  this.server.to('chan' + channel.id).emit('leaveChannel', {chanid: channel.id, user: user});
}

@SubscribeMessage('addPassword')
async handleAddPassword(@ConnectedSocket() client: Socket, @MessageBody() chanPasswordDto: ChanPasswordDto) {
  const channel = await this.channelService.getById(chanPasswordDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  if (channel === null || user === null)
    return; // No such User or Channel
  if (user.id != channel.owner?.id)
    return; // You are not the admin
  this.channelService.update(channel.id, {
    password: chanPasswordDto.password,
    chanType: 2,
  });
  this.server.emit('addPasswordOK', channel.id);
}

@SubscribeMessage('rmPassword')
async handleRmPassword(@ConnectedSocket() client: Socket, @MessageBody() chanPasswordDto: ChanPasswordDto) {
  const channel = await this.channelService.getById(chanPasswordDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  if (channel === null || user === null)
    return; // No such User or Channel
  if (user.id != channel.owner?.id)
    return; // You are not the admin
  this.channelService.update(channel.id, {
    rmPassword: 1,
    chanType: 0,
  });
  this.server.emit('rmPasswordOK', channel.id);
  }

@SubscribeMessage('changePassword')
async handleChangePassword(@ConnectedSocket() client: Socket, @MessageBody() chanPasswordDto: ChanPasswordDto) {
  const channel = await this.channelService.getById(chanPasswordDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  if (channel === null || user === null)
    return; // No such User or Channel
  if (user.id != channel.owner?.id)
    return; // You are not the admin
  if (channel.password === null)
    return; // Not already a password
  this.channelService.update(channel.id, {
    password: chanPasswordDto.password,
    chanType: 2,
  });
  client.emit('changePasswordOK', channel.id);
  }

@SubscribeMessage('BanUser')
async handleBanUser(@ConnectedSocket() client: Socket, @MessageBody() banUserDto: BanUserDto) {
  if (banUserDto.timeout && isNaN(parseInt(banUserDto.timeout))) {
    client.emit('banUserFailed', 'Please put a number');
    return;
  }
  
  const channel = await this.channelService.getById(banUserDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  const userBan = await this.userService.getById(banUserDto.userid);
  if (channel === null || user === null || userBan === null) {
    client.emit('banUserFailed', 'No such Channel or User');
    return;
  }
  if (user.id === userBan.id) {
    client.emit('banUserFailed', 'You can not ban yourself')
    return;
  }
  if (!(await this.channelService.isUserAdmin({chanid: channel.id, userid: user.id}))) {
    client.emit('banUserFailed', 'You are not Admin on this channel');
    return;
  }
  if (channel.owner?.id != user.id && await this.channelService.isUserAdmin({chanid: channel.id, userid: userBan.id})) {
    client.emit('banUserFailed', 'You can not Ban an Admin');
    return;
  }
  await this.channelService.banUser(banUserDto);
  await this.channelService.rm({user: userBan, chanid: channel.id});

  this.findSocketFromUser(userBan)?.leave('chan' + channel.id);
  if (banUserDto.timeout) {
    setTimeout(async () => {
      try {
      await this.channelService.unbanUser(banUserDto); }
      catch(e) {}
    }, parseInt(banUserDto.timeout) * 1000);
  }
  const socketId = this.findSocketFromUser(userBan);
  if (socketId)
    this.server.to(socketId.id).emit('banUser', {
      chanid: channel.id,
      userid: userBan.id,
      timer: Number(banUserDto.timeout) * 1000
    });
  client.emit('banUserOK', user.id, channel.id);
  this.server.to('chan' + channel.id).emit('banUser', {
    chanid: channel.id,
    userid: userBan.id,
    timer: Number(banUserDto.timeout) * 1000,
  });
}

@SubscribeMessage('unBan')
async handleunBanUser(@ConnectedSocket() client: Socket, @MessageBody() banUserDto: BanUserDto) {
  const channel = await this.channelService.getById(banUserDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  const userBan = await this.userService.getById(banUserDto.userid);
  if (channel === null || user === null || userBan === null) {
    client.emit('unbanFailed', 'No such Channel or User');
    return;
  }
  if (!(await this.channelService.isUserBanned(banUserDto))) {
    client.emit('unbanUserFailed', 'User is not banned');
    return;
  }
  if (channel.owner?.id != user.id) {
    client.emit('unbanUserFailed', 'You are not the Owner of this channel');
    return;
  }
  await this.channelService.unbanUser(banUserDto);
  
  const socketId = this.findSocketFromUser(userBan);
  if (socketId)
    this.server.to(socketId.id).emit('unban', {chanid: channel.id, userid: userBan.id, timer: banUserDto.timeout}); // not useful (delete or use ? ) selee confirmation needed or adam or pop up, up, je remove si pas d'objection
  client.emit('unbanOK', userBan.id, channel.id);
}

@SubscribeMessage('MuteUser')
async handleMuteUser(@ConnectedSocket() client: Socket, @MessageBody() muteUserDto: MuteUserDto) {
  if (muteUserDto.timeout && isNaN(parseInt(muteUserDto.timeout))) {
    client.emit('muteUserFailed', 'Please put a number');
    return;
  }
  const channel = await this.channelService.getById(muteUserDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  const userMute = await this.userService.getById(muteUserDto.userid);
  if (channel === null || user === null || userMute === null) {
    client.emit('muteUserFailed', 'No such Channel or User');
    return;
  }
  if (user.id === userMute.id) {
    client.emit('muteUserFailed', 'You can not mute yourself');
    return;
  }
  if (!(await this.channelService.isUserAdmin({chanid: channel.id, userid: user.id}))) {
    client.emit('muteUserFailed', 'You are not Admin on this channel');
    return;
  }
  if (channel.owner?.id != user.id && await this.channelService.isUserAdmin({chanid: channel.id, userid: userMute.id})) {
    client.emit('muteUserFailed', 'You can not Mute an Admin');
    return;
  }
  await this.channelService.muteUser(muteUserDto);
  if (muteUserDto.timeout) {
    setTimeout(async () => {  
      try {
      await this.channelService.unmuteUser(muteUserDto); }
      catch (e) {
        
      }
    }, parseInt(muteUserDto.timeout) * 1000);
  }
  client.emit('muteUserOK', user.id, channel.id);
  this.server.to('chan' + channel.id).emit('muteUser', {
    chanid: channel.id,
    userid: userMute.id,
    timeout: Number(muteUserDto.timeout) * 1000,
  });
}

@SubscribeMessage('Unmute')
async handleUnMute(@ConnectedSocket() client: Socket, @MessageBody() muteUserDto: MuteUserDto) {
  const channel = await this.channelService.getById(muteUserDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  const userMute = await this.userService.getById(muteUserDto.userid);
  if (channel === null || user === null || userMute === null) {
    client.emit('UnmuteUserFailed', 'No such Channel or User');
    return;
  }
  if (!(await this.channelService.isUserMuted(muteUserDto))) {
    client.emit('unmuteUserFailed', 'User is not muted');
    return;
  }
  if (channel.owner?.id != user.id && !(await this.channelService.isUserAdmin({chanid: channel.id, userid: user.id}))) {
    client.emit('muteUserFailed', 'You are not Admin on this channel');
    return;
  }
  this.channelService.unmuteUser(muteUserDto);
  client.emit('unmuteUserOK', user.id, channel.id); // probably to remove, or pop - up or adam, selee confirmation needed
  this.server.to('chan' + channel.id).emit('unmuteUser', muteUserDto);

}

@SubscribeMessage('GiveAdmin')
async handleGiveAdmin(@ConnectedSocket() client: Socket, @MessageBody() giveAdminDto: GiveAdminDto) {
  const channel = await this.channelService.getById(giveAdminDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  const userGiveAdmin = await this.userService.getById(giveAdminDto.userid);
  if (channel === null || user === null || userGiveAdmin === null)
    return; // No such User or Channel
  if (!(await this.channelService.isUserAdmin({chanid: channel.id, userid: user.id})))
    return; // You are not Admin on This Channel
  if (await this.channelService.isUserAdmin({chanid: channel.id, userid: userGiveAdmin.id}))
    return; // User already Admin on This Channel
  this.channelService.addAdmin(giveAdminDto);
  this.server.to("chan" + channel.id).emit('giveAdminOK', {userid: giveAdminDto.userid, chanid: channel.id});
}

@SubscribeMessage('AddPeoplePrivate')
async handleInvite(@ConnectedSocket() client: Socket, @MessageBody() inviteDto: InviteDto)
{
  const channel = await this.channelService.getById(inviteDto.chanid);
  const user = await this.userService.getById(client.handshake.auth.user.id);
  if (channel === null || user === null)
    return; // 'No such Channel or User');
  if (user.id != channel.owner?.id)
    return; // 'You are not Owner of this channel');
  this.inviteToChan(inviteDto.usersId, channel.id, client);
  client.emit('inviteOK');
  this.server.to("chan" + channel.id).emit('invitePrivate', inviteDto);
}

async inviteToChan(usersId: number[], chanid: number, client?: Socket)
{
  const channel = await this.channelService.getById(chanid)
    if (!channel)
      return;
  for (const userId of usersId) {
    const user = await this.userService.getById(userId);
    if (user === null)
      continue;
    if (await this.channelService.isUserinChan(channel, user))
      continue;
    if (await this.channelService.isUserBanned({chanid: channel.id, userid: user.id})) {
      await this.channelService.unbanUser({chanid: channel.id, userid: user.id});
      client?.emit('unbanOK', user.id, channel.id);
    }
    const socketIdToWho = this.findSocketFromUser(user);
    if (socketIdToWho)
      this.server.to(socketIdToWho.id).emit('invited', chanid);
    socketIdToWho?.join("chan" + chanid);
    await this.channelService.add({user: user, chanId: chanid});
  }
}

}
