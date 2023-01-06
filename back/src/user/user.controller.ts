import { BadRequestException, Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  @Get("meuh")
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // return this.userService.create(createUserDto);
    try {
      return await this.userService.create({
        email: "manumandu@dmanumanu.fr",
        password: "I am an encrypted password",
        username: "manudd"
      });
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
}
