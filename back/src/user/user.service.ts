import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UpdateUserDto } from "../user/dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = this.usersRepository.create(createUserDto);
    const result = await this.usersRepository.insert(user);
    return {...user, ...result.generatedMaps[0]};
  }

  findAll() {
    return `This action returns all user`;
  }

  getById(id: number) {
    return this.usersRepository.findOneBy({
      id: id
    })
  }

  getByUsername(username: string) {
    return this.usersRepository.findOneBy({
      username: username
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.getById.name
    return `This action updates a #${id} user ${this.getByUsername('elabasqu')}`;
  }

  remove(id: number) {
    this.usersRepository.delete(id);
    return `This action removes a #${id} user`;
  }
}
