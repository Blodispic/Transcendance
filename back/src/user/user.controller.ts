import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Req, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { editFileName, imageFilter } from 'src/app.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { user } from 'src/game/game.controller';
import { FriendRequest } from './entities/friend-request.entity';
import { authenticator } from 'otplib';
import { Results } from 'src/results/entities/results.entity';
import { CreateResultDto } from 'src/results/dto/create-result.dto';
import { JwtGuard } from 'src/Oauth/jwt-auth.guard';
import { Server, Socket } from "socket.io";
import { userList } from 'src/app.gateway';
import { WebSocketServer } from '@nestjs/websockets';
import { plainToClass } from 'class-transformer';
import { GetUser } from './getUser';



@Controller('user')
export class UserController {
  // WebSocket server instance
  @WebSocketServer()
  server: Server;

  constructor(private readonly userService: UserService) { }

  // Creates a new user
  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await plainToClass(User, this.userService.create(createUserDto));
  }

  // Retrieves all users
  @Get()
  @UseGuards(JwtGuard)
  async findAll() {
    return await plainToClass(User, this.userService.findAll());
  }

  // Creates a new result for a specific user
  @Post('results')
  @UseGuards(JwtGuard)
  async createResults(@Body() resultDto: CreateResultDto) {
    return await this.userService.createResult(resultDto);
  }

  // Retrieves a user by their username
  @Get('username/:username')
  @UseGuards(JwtGuard)
  async GetbyUsername(@Param('username') username: string) {
    return await plainToClass(User, this.userService.getByUsername(username));
  }

  // Retrieves a user by their ID
  @Get('id/:id')
  @UseGuards(JwtGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await plainToClass(User, this.userService.getById(id));
  }

  // Retrieves all results for a specific user
  @Get('game/:id')
  @UseGuards(JwtGuard)
  async getResult(@Param('id', ParseIntPipe) id: number) {
    return await plainToClass(Results, this.userService.getResults(id));
  }

  // Retrieves a user by their access token
  @Post('access_token')
  @UseGuards(JwtGuard)
  async GetbyAccessToken(@Body() token: any) {
    return await plainToClass(User, this.userService.GetByAccessToken(token));
  }

  // Enables two-factor authentication for a specific user
  @Post('2fa/qrcode')
  @UseGuards(JwtGuard)
  async enable2FA(@GetUser() user: User) {
    const realUser = await this.userService.getById(user.id);
    if (!realUser) {
      throw new NotFoundException(`User with id ${user.id} not found`);
    }
    if (realUser.twoFaEnable == false) {
      const secret = authenticator.generateSecret();
      this.userService.enable2FA(realUser, secret);
      const otpauthURL = authenticator.keyuri('Transcendence', realUser.email, secret);
      const qrCode = await this.userService.generateQRCode(otpauthURL);
      return { qrCode };
    } else return 'Qr code active';
  }

  // Checks if the given code matches the user's two-factor authentication code
  @Post('2fa/check')
  @UseGuards(JwtGuard)
  async checkCode(@GetUser() user: User, @Body('code') code: string) {
    const result = await this.userService.check2FA(user.id, code);
    return { result };
  }

  // Retrieves the status of a friend request
  @Post('friend-request/status/:id')
  @UseGuards(JwtGuard)
  async GetFriendRequestStatus(@Param('id', ParseIntPipe) id: number, @Body() user: { userId: number }) {
    return this.userService.GetFriendRequestStatus(id, user.userId);
  }

  // Retrieves all friend requests for a specific user
  @Post('friendsRequest')
  @UseGuards(JwtGuard)
  GetFriendsRequest(@GetUser() user: User) {
    return this.userService.GetFriendsRequest(user.id);
  }

  // Retrieves all friends for a specific user
  @Post('friends')
  @UseGuards(JwtGuard)
  GetFriends(@GetUser() user: User) {
    return this.userService.GetFriends(user.id);
  }

  // Retrieves all match requests for a specific user
  @Post('matches')
  @UseGuards(JwtGuard)
  GetMatches(@GetUser() user: User) {
    return this.userService.GetMatchRequest(user.id);
  }

  // Accepts a friend request
  @Post("friends/accept")
  @UseGuards(JwtGuard)
  async acceptFriendRequest(@Body() body: { friendId: number, userId: number }) {
    const realUser = await this.userService.addFriend(body.friendId, body.userId);
    return await this.userService.DeleteFriendRequest(body.userId, body.friendId);
  }

  // Declines a friend request
  @Post("friends/decline")
  @UseGuards(JwtGuard)
  async declineFriendRequest(@Body() body: { friendId: number, userId: number }) {
    return await this.userService.DeleteFriendRequest(body.userId, body.friendId);
  }

  // Retrieves the avatar for a specific user
  @Get(':id/avatar')
  async getAvatar(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
    const user = await this.userService.getById(id);
    if (user) {
      if (user.avatar) {
        return res.sendFile(user.avatar, { root: './storage/images/' });
      } else {
        return res.redirect(user.intra_avatar)
      }
    } else {
      return null;
    }
  }

  // Checks if two users are friends
  @Post('friend/check')
  @UseGuards(JwtGuard)
  async checkFriends(@Body() body: { myId: number, friendId: number }) {
    return (await this.userService.checkFriends(body.myId, body.friendId));
  }

  // Sets the avatar for a specific user
  @Patch(':id/avatar')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './storage/images/',
        filename: editFileName,
      }),
      fileFilter: imageFilter,
    }),
  )
  async setAvatar(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: any, @Body('username') username: string) {
    await this.userService.setAvatar(id, username, file);
    return { message: 'Avatar set successfully' };
  }

  // Updates a user's information
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() user: any) {
    return plainToClass(User, this.userService.update(+id, user));
  }

  // Sends a friend request to a user
  @Post('friend-request/send/:id')
  @UseGuards(JwtGuard)
  sendFriendRequest(
    @Param('id', ParseIntPipe) id: number, @Body() user: { userId: number }) {
    return this.userService.sendFriendRequest(id, user.userId)
  }

  // Deletes a friend for a user
  @Delete('deletefriend/:id')
  async deleteFriend(@Param('id', ParseIntPipe) id: number, @Body() friendId: { friendId: number }) {
    await this.userService.removeFriend(friendId.friendId, id)
    return plainToClass(User, await this.userService.removeFriend(id, friendId.friendId));
  }

  // Blocks a user for another user
  @Post('block/:id')
  @UseGuards(JwtGuard)
  async addBlock(@Param('id') id: number, @Body() blockedId: { blockedId: number }) {
    return await this.userService.addBlock(id, blockedId.blockedId);
  }

  // Removes a block for a user
  @UseGuards(JwtGuard)
  @Delete('unblock/:id')
  async RmBlock(@Param('id') id: number, @Body() blockedId: { blockedId: number }) {
    return await this.userService.RmBlock(id, blockedId.blockedId);
  }

  // Checks the relationship between two users
  @Post("relations")
  @UseGuards(JwtGuard)
  async checkRelations(@Body() body: { userId: number, friendId: number }) {
    return await this.userService.checkRelations(body.friendId, body.userId);
  }

}
