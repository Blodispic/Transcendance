import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Request, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // try {
    return await this.userService.create(createUserDto);
    // } catch (error) 
    // throw new BadRequestException(error.detail);
    // }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.userService.create(user)
  }

  @Post('results')
  async createResults(@Body() resultDto: CreateResultDto) {
    return await this.userService.createResult(resultDto);
  }

  @Get('username/:username')
  GetbyUsername(@Param('username') username: string) {
    return this.userService.getByUsername(username);
  }

  @Get('id/:id')
  findOne(@Param('id') id: number) {
    return this.userService.getById(id);
  }

  @Get('game/:id')
  async getResult(@Param('id') id: number) {
    return await this.userService.getResults(id)
  }

  @Post('access_token')
  GetbyAccessToken(@Body() token: any) {
    return this.userService.GetByAccessToken(token);
  }

  @Post('2fa/qrcode')
  async enable2FA(@Body() user: any) {
    const realUser = await this.userService.getById(user.id);
    const secret = authenticator.generateSecret();
    this.userService.enable2FA(realUser, secret);
    const otpauthURL = authenticator.keyuri('Transcendence', user.email, secret);
    const qrCode = await this.userService.generateQRCode(otpauthURL);
    return { qrCode };
  }

  @Post('2fa/check')
  async checkCode(@Body() user: { id: number, code: string }) {
    const result = await this.userService.check2FA(user.id, user.code);
    return { result };
  }


  @Post('friend-request/status/:id')
  async GetFriendRequestStatus(@Param('id') id: number, @Body() user: User) {
    return this.userService.GetFriendRequestStatus(id, user);
  }

  @Post('friends')
  GetFriends(@Body() user: User) {
    return this.userService.GetFriendsRequest(user);
  }

  @Post('matches')
  GetMatches(@Body() user: User) {
    return this.userService.GetMatchRequest(user);
  }

  @Post("friends/accept")
  async acceptFriendRequest(@Body() body: { friendId: any, user: User }) {
    this.userService.addFriend(body.friendId, body.user);
    return await this.userService.updateFriendRequestStatus(body.friendId, body.user, {
      status: "Accepted",
    });
  }

  @Post("friends/decline")
  async declineFriendRequest(@Body() body: { friendId: number, user: User }) {
    return await this.userService.updateFriendRequestStatus(body.friendId, body.user, {
      status: "Declined",
    });
  }

  @Get(':id/avatar')
  async getAvatar(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
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

  @Patch(':id/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './storage/images/',
        filename: editFileName,
      }),
      fileFilter: imageFilter,
    }),
  )
  async setAvatar(@Param('id') id: number, @UploadedFile() file: any, @Body('username') username: string) {
    await this.userService.setAvatar(id, username, file);
    return { message: 'Avatar set successfully' };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() user: any) {
    return this.userService.update(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('friend-request/send/:id')
  sendFriendRequest(
    @Param('id') id: number, @Body() user: User) {
    if (user) {
      return this.userService.sendFriendRequest(id, user)
    }
  }

  @Delete('deletefriend/:id')
  async deleteFriend(@Param('id') id: number, @Body() friend: User) {
    return await this.userService.removeFriend(id, friend);
  }
}
