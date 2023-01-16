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
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    this.usersRepository.delete(id);
    return `This action removes a #${id} user`;
  }

  //ID est le user actuel, friend est le user a ajouter de type User
  //On push dans le tableau le user friend et on save user qui a été changé dans userRepository
  async addFriend( id: number, friend: User ): Promise<User> {
    const user = await this.usersRepository.getById(id);
    user.friends.push(friend);
    return await this.usersRepository.save(user);
  }

  async addFriendById( id: number, friendId: number ): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    const friend = await this.usersRepository.findOne(friendId);
    user.friends.push(friend);
    return await this.usersRepository.save(user);
  }

  async removeFriend( id: number, friend: User ){
    const user = await this.usersRepository.findOne(id);
    return `This action remove a friends #${id} user`;
  }

  async removeFriendById( id: number, friendId: number ) {
    const user = await this.usersRepository.findOne(id);
    const friend = await this.usersRepository.findOne(friendId);
    return `This action remove a friends #${id} user by id`;
  }
}
