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
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = this.usersRepository.create(createUserDto);
    const result = await this.usersRepository.insert(user);
    return { ...user, ...result.generatedMaps[0] };
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
  async addFriend( id: number, friend: User ): Promise<User | null> {
    const user = await this.usersRepository.findOne({where: {id}});
    if (user)
    {
      user.friends.push(friend);
      return await this.usersRepository.save(user);
    }
    return (null);
  }

  async addFriendById( id: number, friendId: number ): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      relations: {
        friends: true,
      },
      where: {id: id}});
    const friend = await this.usersRepository.findOne({where: {id: friendId}});
    if (user && friend && id != friendId)
    {
      if(!user.friends)
      {
        user.friends = [];
        console.log("No friends");
      }
      user.friends.push(friend);
      return await this.usersRepository.save(user);
    }
    if (!user)
      console.log("User doesn't exists");
    if (!friend)
      console.log("Friend doesn't exists");
    if (id == friendId)
      console.log("user can't be friend with himself");
    return user;
  }

  async removeFriend( id: number, friend: User ){
    const user = await this.usersRepository.findOneBy({id: id});
    return user;
  }

  async removeFriendById( id: number, friendId: number ) {
    const user = await this.usersRepository.findOneBy({id: id});
    const friend = await this.usersRepository.findOneBy({id: friendId});
    return user;
  }
}
