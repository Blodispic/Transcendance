import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { editFileName, imageFilter } from 'src/app.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // try {
      return await this.userService.create(createUserDto);
    // } catch (error) {
      // throw new BadRequestException(error.detail);
    // }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.getById(id);
  }

  @Post('Access_token')
  GetbyAccessToken(@Body() accessToken: string) {
    return this.userService.GetByAccessToken(accessToken);
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
 
  @Post('addfriend/:id')
  async addFriend(@Param('id') id: number, @Body() friend: User) {
    return await this.userService.addFriend(id, friend);
  }

  @Post(':id/addfriend/:friendId')
  async addFriendbyId(@Param('id') id: number, @Param('friendId') friendId: number) {
    return await this.userService.addFriendById(id, friendId);
  }

  @Delete('deletefriend/:id')
  async deleteFriend(@Param('id') id: number, @Body() friend: User) {
    return await this.userService.removeFriend(id, friend);
  }
}
