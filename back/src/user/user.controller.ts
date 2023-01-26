import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Request, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { editFileName, imageFilter } from 'src/app.service';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { user } from 'src/game/game.controller';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  createUser(@Body() user: CreateUserDto){
    return this.userService.create(user)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.getById(id);
  }

  @Post('access_token')
  GetbyAccessToken(@Body() token: any) {
    return this.userService.GetByAccessToken(token);
  }

  @Get('friend-request/status/:friendId')
  async GetFriendRequestStatus(@Param('friendId') friendId: number, @Body() user: User) {
    if (user)
      return this.userService.GetFriendRequestStatus(friendId, user);
    else
      return ("User not found");
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() user: any) {
    return this.userService.update(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('friend-request/send/:friendId')
  sendFriendRequest(
    @Param('friendId') friendId: number, @Body() user: User) {
    if (user)
      return this.userService.sendFriendRequest(friendId, user)
  }


  @Post('addfriend/:friendId')
  async addFriend(@Param('friendId') friendId: number, @Body() user: User) {
    return await this.userService.addFriend(friendId, user);
  }

  @Post(':id/addfriend/:friendId')
  async addFriendbyId(@Param('id') id: number, @Param('friendId') friendId: number) {
    return await this.userService.addFriendById(friendId, id);
  }

  @Delete('deletefriend/:id')
  async deleteFriend(@Param('id') id: number, @Body() friend: User) {
    return await this.userService.removeFriend(id, friend);
  }


}