import { BadRequestException, Body, Controller, Post, Delete, Get, Param, Patch } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get("create1")
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
 
  @Post('/addfriend/:id')
  async addFriend(@Param('id') id: number, @Body() friend: User) {
      return await this.userService.addFriend(id, friend);
  }

  @Delete('/deletefriend/:id')
    async deleteFriend(@Param('id') id: number, @Body() friend: User) {
        return await this.userService.removeFriend(id, friend);
    }
}
