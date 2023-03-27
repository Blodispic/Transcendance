import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { editFileName, imageFilter } from 'src/app.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { authenticator } from 'otplib';
import { JwtGuard } from 'src/Oauth/jwt-auth.guard';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { plainToClass } from 'class-transformer';
import { GetUser } from './getUser';
import { UpdateUserDto } from './dto/update-user.dto';

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

  // Retrieves a user by their access token
  @Post('access_token')
  async GetbyAccessToken(@Body() token: any) {
    return await plainToClass(User, this.userService.GetByAccessToken(token));
  }

  // Enables two-factor authentication for a specific user
  @Post('2fa/qrcode')
  @UseGuards(JwtGuard)
  async enable2FA(@GetUser() user: User) {
    if (user.twoFaEnable == false) {
      const secret = authenticator.generateSecret();
      this.userService.enable2FA(user, secret);
      const twoFactorName = process.env.TWO_FACTOR_NAME || '';
      const otpauthURL = authenticator.keyuri(twoFactorName, user.email, secret);
      const qrCode = await this.userService.generateQRCode(otpauthURL);
      return { qrCode };
    } else return 'Qr code active';
  }

  // Checks if the given code matches the user's two-factor authentication code
  @Post('2fa/check')
  @UseGuards(JwtGuard)
  async checkCode(@GetUser() user: User, @Body('code') code: string) {
    const result = await this.userService.check2FA(user, code);
    return { result };
  }

  // Retrieves all friend requests for a specific user
  @Post('friendsRequest')
  @UseGuards(JwtGuard)
  GetFriendsRequest(@GetUser() user: User) {
    return this.userService.GetFriendsRequest(user.id);
  }

  // Retrieves all friends for a specific user
  @Get('friends')
  @UseGuards(JwtGuard)
  GetFriends(@GetUser() user: User) {
    console.log('User = ', user);
    return this.userService.GetFriends(user.id);
  }

  // Retrieves all match requests for a specific user
  @Post('matches')
  @UseGuards(JwtGuard)
  GetMatches(@GetUser() user: User) {
    return this.userService.GetMatchRequest(user.id);
  }

  // Accepts a friend request
  @Post('friends/accept')
  @UseGuards(JwtGuard)
  async acceptFriendRequest(@GetUser() user: User, @Body('friendId') friendId: number) {
    await this.userService.addFriend(friendId, user);
    return await this.userService.DeleteFriendRequest(user, friendId);
  }

  // Declines a friend request
  @Post('friends/decline')
  @UseGuards(JwtGuard)
  async declineFriendRequest(@GetUser() user: User, @Body('friendId') friendId: number) {
    return await this.userService.DeleteFriendRequest(user, friendId);
  }

  // Retrieves the avatar for a specific user
  @Get(':id/avatar')
  async getAvatar(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
    const user = await this.userService.getById(id);
    if (user) {
      if (user.avatar) {
        return res.sendFile(user.avatar, { root: './storage/images/' });
      } else {
        return res.redirect(user.intra_avatar);
      }
    } else {
      return null;
    }
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
  async setAvatar(@GetUser() user: User, @UploadedFile() file: Express.Multer.File, @Body('username') username: string) {
    await this.userService.setAvatar(user, username, file);
    return { message: 'Avatar set successfully' };
  }

  // Updates a user's information
  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return plainToClass(User, this.userService.update(user.id, updateUserDto));
  }

  // Sends a friend request to a user
  @Post('friend-request/send/:id')
  @UseGuards(JwtGuard)
  sendFriendRequest(
    @Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.userService.sendFriendRequest(id, user);
  }

  // Deletes a friend for a user
  @Delete('deletefriend/:id')
  @UseGuards(JwtGuard)
  async deleteFriend(@GetUser() user: User, @Body('friendId') friendId: number) {
    await this.userService.removeFriend(friendId, user.id);
    return plainToClass(User, await this.userService.removeFriend(user.id, friendId));
  }

  // Blocks a user for another user
  @Post('block/:id')
  @UseGuards(JwtGuard)
  async addBlock(@Body('blockedId') blockedId: number, @GetUser() user: User) {
    const blocked = await this.userService.getById(blockedId);
    if (blocked)
      await this.userService.DeleteFriendRequest(blocked, user.id);
    await this.userService.DeleteFriendRequest(user, blockedId);
    return await this.userService.addBlock(user, blockedId);
  }

  // Removes a block for a user
  @UseGuards(JwtGuard)
  @Delete('unblock/:id')
  async RmBlock(@Body('blockedId') blockedId: number, @GetUser() user: User) {
    return await this.userService.RmBlock(user.id, blockedId);
  }

  // Checks the relationship between two users
  @Post('relations')
  @UseGuards(JwtGuard)
  async checkRelations(@GetUser() user: User, @Body('friendId') friendId: number) {
    return await this.userService.checkRelations(friendId, user.id);
  }

}
