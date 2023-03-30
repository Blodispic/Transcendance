import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Results } from 'src/results/entities/results.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { Status, User } from './entities/user.entity';
import { FriendRequest } from './entities/friend-request.entity';
import { FriendRequestDto } from './dto/friend-request.dto';
import { JwtService } from '@nestjs/jwt';
import { FriendRequestStatus } from './interface/friend-request.interface';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { CreateResultDto } from 'src/results/dto/create-result.dto';
import { Server } from 'http';
import { userList } from 'src/app.gateway';

@Injectable()
export class UserService {

  server: Server;
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Results)
    private readonly resultsRepository: Repository<Results>,
    private jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const check = await this.usersRepository.findOneBy({
      login: createUserDto.login,
    });
    if (check)
      return (check);
    const user: User = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async createResult(resultDto: CreateResultDto) {
    const winner = await this.usersRepository.findOneBy({id: resultDto.winnerId});
    const loser = await this.usersRepository.findOneBy({id: resultDto.loserId});
    if (!winner || !loser) {
      throw new NotFoundException("User not found");
    }
    winner.elo += 50;
    loser.elo -= 50;
    winner.win += 1;
    loser.lose += 1;

    const result = this.resultsRepository.create({
      winner,
      loser,
      loser_score: resultDto.loser_score,
      winner_score: resultDto.winner_score,
      loser_elo: loser.elo,
      winner_elo: winner.elo,
    });
    return this.resultsRepository.save(result);
  }

  async save(updateUserDto: UpdateUserDto) {
    return (await this.usersRepository.save(updateUserDto));
  }

  async delete(updateUserDto: UpdateUserDto) {
    return (await this.usersRepository.delete(updateUserDto));
  }


  async generateQRCode(secret: string): Promise<string> {
    const qrCode = await QRCode.toDataURL(secret);
    return qrCode;
  }

  async enable2FA(user: User, secret: string): Promise<void> {
    user.two_factor_secret = secret;
    await this.usersRepository.save(user);
  }

  async check2FA(user: User, userCode: string): Promise<boolean> {
    if (user) {
      return authenticator.check(userCode, user.two_factor_secret);
    }
    throw new NotFoundException('User not found');
  }

  findAll() {
    return this.usersRepository.find();
  }

  getById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      relations: {
        friends: true,
        channels: true,
        owned: true,
        blocked: true,
      },
      where: { id: id },
    });
  }

  getByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOne({
      relations: [
        'blocked',
        'friends',
        'channels',
        'owned',
        'sendFriendRequests',
        'receiveFriendRequests',
      ],
      where: {
        login: login,
      },
    });
  }

  async GetByAccessToken(access_token: string) {
    const decoded_access_token = await this.jwtService.decode(access_token, { json: true }) as { username: string, iat: number, exp: number } | null;
    if (!decoded_access_token) {
      throw new BadRequestException('Invalid access token');
    }
    
    const user = await this.usersRepository.findOneBy({ login: decoded_access_token.username });
    
    if (decoded_access_token.exp && decoded_access_token.exp < Date.now() / 1000) {
      throw new NotFoundException('Token expired');
    }
    else if (user) {
      for (const iterator of userList) {
        if (iterator.handshake.auth.user.id === user.id)
          throw new BadRequestException('t\'as deja un tab frero');
      }
      return user;
    }
    throw new NotFoundException('Token user not found');
  }

  async getByUsername(username: string) {
    const userfindName = await this.usersRepository.findOne({
      relations: {
        friends: true,
      },
      where: { username: username },
    });
    if (userfindName)
      return userfindName;
    else
      throw new NotFoundException('Username dont exist');
  }

  async update(user: User, userUpdate: UpdateUserDto) {
    //Si vous voulez plus de chose a update, mettez le dans le body et faites un iff
    if (userUpdate.username) {
      const checkUsername = await this.usersRepository.findOneBy({
        username: userUpdate.username,
      });
      if (checkUsername && checkUsername.id !== user.id) {
        throw new NotFoundException('Username exists');
      }
      else
        user.username = userUpdate.username;
    }
    if (userUpdate.twoFaEnable != undefined) {
      user.twoFaEnable = userUpdate.twoFaEnable;
    }
    return await this.usersRepository.save(user);
  }

  async setAvatar(user: User, username: string, file: Express.Multer.File) {
    if (user) {
      user.avatar = file.filename;
      user.username = username;
      return await this.usersRepository.save(user);
    }
    throw new NotFoundException('User not found');
  }

  async sendFriendRequest(friendId: number, creator: User) {

    if (friendId == creator.id) {
      return ({ message: 'You can\'t add yourself' });
    }

    const friend: User | null = await this.usersRepository.findOne({
      relations: {
        friends: true,
      },
      where: { id: friendId },
    });
    if (!friend) {
      return ({ message: 'Friend does not exist' });
    }

    const existingRequest = await this.friendRequestRepository.findOne({
      relations: {
        creator: true,
        receiver: true,
      },
      where: [{ creator: creator, receiver: friend }],
    });
    if (existingRequest) {
      throw new UnauthorizedException('Friend Request already send');
    }

    const friendReqExists = await this.friendRequestRepository.findOne({
      relations: {
        creator: true,
        receiver: true,
      },
      where: [{ receiver: creator, creator: friend }],
    });
    
    if (friendReqExists) {
      await this.addFriend(friendId, creator);
      return await this.DeleteFriendRequest(creator, friendId);
    }
    
    const friendRequest: FriendRequestDto = {
      creatorId: creator.id,
      creator: creator,
      receiverId: creator.id,
      receiver: friend,
      status: 'Pending',
    };

    await this.friendRequestRepository.save(friendRequest);
    const friendRequestPush: FriendRequest | null = await this.friendRequestRepository.findOne({
      where: [{ creator: creator, receiver: friend }],
    });
    if (friendRequestPush) {
      if (!friend.receiveFriendRequests)
        friend.receiveFriendRequests = [];
      friend.receiveFriendRequests.push(friendRequestPush);
      await this.usersRepository.save(friend);
      if (!creator.sendFriendRequests)
        creator.sendFriendRequests = [];
      creator.sendFriendRequests.push(friendRequestPush);
      await this.usersRepository.save(creator);
    }
    return { message: 'Friend request sent' };
  }

  async DeleteFriendRequest(friend: User, creatorId: number) {

    const friendRequestPush = await this.friendRequestRepository.findOne({
      where: [{ creatorId: creatorId, receiverId: friend.id }],
    });

    if (friendRequestPush) {
      await this.friendRequestRepository.delete(friendRequestPush.id);
    }
    return await this.usersRepository.findOneBy({
      id: creatorId,
    });
  }

  async GetFriendRequestStatus(friendId: number, userId: number) {
    const creator = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (!creator) {
      throw new NotFoundException('Creator doesn\'t exists');
    }

    const friendRequest = await this.friendRequestRepository.findOne({
      where: [{ creator: creator, receiver: { id: friendId } }],
    });
    if (!friendRequest) {
      throw new NotFoundException('Friend request does not exist');
    }
    return { status: friendRequest.status };
  }

  async GetFriendsRequest(userId: number) {
    const receiver = await this.usersRepository.findOne({
      relations: ['receiveFriendRequests', 'receiveFriendRequests.creator', 'friends'],
      where: { id: userId },
    });
    if (!receiver) {
      return [];
    }
    return receiver.receiveFriendRequests.map(request => {
      if (request.creator && request.creator.avatar) {
        return {
          name: request.creator.username,
          avatar: request.creator.avatar,
          id: request.creator.id,
          ReqStatus: request.status,
          UserStatus: request.creator.status,
        };
      }
      else {
        return {
          name: request.creator.username,
          avatar: request.creator.intra_avatar,
          id: request.creator.id,
          ReqStatus: request.status,
          UserStatus: request.creator.status,
        };
      }
    });
  }

  async GetFriends(userId: number) {
    const user = await this.usersRepository.findOne({
      relations: ['friends'],
      where: { id: userId },
    });
    if (!user) {
      return [];
    }
    return user.friends.map(request => {
      if (request.avatar) {
        return {
          name: request.username,
          avatar: request.avatar,
          id: request.id,
          UserStatus: request.status,
        };
      }
      else {
        return {
          name: request.username,
          avatar: request.intra_avatar,
          id: request.id,
          UserStatus: request.status,
        };
      }
    });
  }

  async GetMatchRequest(userId: number) {
    return this.resultsRepository.find({
      relations: {
        winner: true,
        loser: true,
      },
      where: [
        { winner: { id: userId } },
        { loser: { id: userId } },
      ]
    });
  }


  async updateFriendRequestStatus(friendId: number, receiverId: number, status: FriendRequestStatus) {
    const receiver = await this.usersRepository.findOneBy({
      id: receiverId,
    });
    if (!receiver) {
      throw new NotFoundException('receiver doesn\'t exists');
    }

    const friendRequest = await this.friendRequestRepository.findOne({
      where: [{ creator: { id: friendId }, receiver: receiver }],
    });
    if (friendRequest) {
      if (status.status) {
        friendRequest.status = status.status;
      }
      return await this.friendRequestRepository.save(friendRequest);
    }
    throw new NotFoundException('Friend Request not found');
  }

  async addFriend(friendId: number, realUser: User): Promise<User | null> {

    if (!realUser)
      throw new NotFoundException('user doesn\'t exists');

    const friend = await this.usersRepository.findOne({
      relations: {
        friends: true,
      },
      where: { id: friendId },
    });
    if (!friend)
      throw new NotFoundException('friend doesn\'t exists');
    if (realUser.id != friendId) {
      if (!realUser.friends) {
        realUser.friends = [];
      }

      if (!friend.friends) {
        friend.friends = [];
      }

      realUser.friends.push(friend);
      friend.friends.push(realUser);
      await this.usersRepository.save(friend);
      return await this.usersRepository.save(realUser);
    }
    return realUser;
  }

  async SetStatus(user: User, status: Status): Promise<User | null> {
    if (!user)
      throw new HttpException('user doesn\'t exists', HttpStatus.BAD_REQUEST);

    const users = await this.usersRepository.findOne({ where: { id: user.id } });
    if (users) {
      users.status = status;
      return await this.usersRepository.save(users);
    }
    return null;
  }

  async addFriendById(friendId: number, id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      relations: {
        friends: true,
      },
      where: { id: id },
    });
    const friend = await this.usersRepository.findOne({ where: { id: friendId } });
    if (user && friend && id != friendId) {
      if (!user.friends) {
        user.friends = [];
      }
      user.friends.push(friend);
      return await this.usersRepository.save(user);
    }
    return user;
  }

  async removeFriend(id: number, friendid: number) {
    const user = await this.usersRepository.findOne({
      relations: ['friends', 'blocked'],
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('UserNotFound');
    }
    user.friends = user.friends.filter((f) => f.id != friendid);
    return this.usersRepository.save(user);
  }

  async checkFriends(myId: number, friendId: number): Promise<boolean> {
    const myUser = await this.usersRepository.findOne({
      relations: ['friends'],
      where: { id: myId },
    });
    if (!myUser)
      return (false);
    // return true ou false si on trouve l'id du friend dans friend
    return (myUser.friends.some(friend => friend.id == friendId));
  }

  async getBlocked(id: number) {
    const user = await this.usersRepository.findOne({
      relations: {
        blocked: true,
      },
      where: { id: id },
    });
    return user ? user.blocked : [];
  }

  async addBlock(user: User, blockedid: number) {
    if (user === null)
      throw new BadRequestException('No such User');
    const blocked = await this.usersRepository.findOne({
      relations: {
        blocked: true,
      },
      where: { id: blockedid },
    });
    if (blocked === null)
      throw new BadRequestException('No such User to block');
    if (user.blocked.find(elem => elem.id === blocked.id) !== undefined)
      throw new BadRequestException('User already blocked');
    user = await this.removeFriend(user.id, blocked.id);
    await this.removeFriend(blocked.id, user.id);
    user.blocked.push(blocked);
    return await this.usersRepository.save(user);
  }

  async RmBlock(user: User, blockedid: number) {
    const blocked = user?.blocked.find(elem => elem.id === blockedid)
    if (blocked === undefined)
      throw new BadRequestException('No such User already blocked');
    const index = user.blocked.indexOf(blocked, 0);
    if (index != -1)
      user.blocked.splice(index, 1);
    return await this.usersRepository.save(user);
  }

  async RmOwned(id: number, chanid: number) {
    const user = await this.usersRepository.findOne({
      relations: { owned: true },
      where: { id: id },
    });
    if (user === null)
      throw new BadRequestException("No such User");
    user.owned = user.owned.filter(elem => elem.id != chanid);    
    return await this.usersRepository.save(user);
  }

  async checkRelations(friendId: number, userId: number) { 
    const realUser = await this.usersRepository.findOne({
      relations: {
        friends: true,
        blocked: true,
        sendFriendRequests: {
          creator: true,
          receiver: true,
        },
        receiveFriendRequests: {
          creator: true,
          receiver: true,
        },
      },
      where: { id: userId },
    });
    if (!realUser) {
      throw new NotFoundException('User doesn\'t exist');
    }
    const friend = realUser.friends.find((friend) => friend.id === friendId);
    if (friend) {
      return ({ relation: 'Friend' });
    }
    const blocked = realUser.blocked.find((blocked) => blocked.id === friendId);
    if (blocked) {
      return ({ relation: 'Blocked' });
    }
    if (realUser.sendFriendRequests) {
      const friendRequestSent = realUser.sendFriendRequests.find(
        (request) => request.receiver.id === friendId,
      );

      if (friendRequestSent) {
        return ({ relation: 'friendRequestSent' });
      }
    }
    if (realUser.receiveFriendRequests) {
      const friendRequestReceived = realUser.receiveFriendRequests.find(
        (request) => request.creator.id === friendId,
      );

      if (friendRequestReceived) {
        return ({ relation: 'friendRequestReceived' });
      }
    }
    return ({ relation: 'Nobody' });
  }
}
