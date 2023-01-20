import { BadRequestException, Body, Controller, Post, Delete, Get, Param, Patch, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/app.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.getById(id);
  }

  @Post(':id/setavatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async setAvatar(@Param('id') id: number, @UploadedFile() file: any, @Body('username') username: string) {
    await this.userService.setAvatar(id, username, file);
    return { message: 'Avatar set successfully' };
  }

  @Get(':id/getavatar')
  async getAvatar(@Param('id') id: number, @Res() res: any) {
    const user = await this.userService.getById(id);
    if (user)
      return res.sendFile(user.avatar, { root: './files' });
    else
      return null;
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