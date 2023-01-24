import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Results } from "src/results/entities/results.entity";
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
    return this.usersRepository.save(user);
  }

  async save(updateUserDto: UpdateUserDto) {
    return (this.usersRepository.save(updateUserDto));
  }

  findAll() {
    return this.usersRepository.find();
  }

  getById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({
      id: id
    })
  }

  getByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOneBy({
      login: login
    })
  }

  GetByAccessToken(accessToken: string) {
    return this.usersRepository.findOneBy({
      access_token: accessToken
    })
  }

  getByUsername(username: string) {
    return this.usersRepository.findOneBy({
      username: username
    })
  }

  async update(id: number, userUpdate: any) {
    const user = await this.usersRepository.findOneBy({
      id: id,
    })
    if (user) {
      //Si vous voulez plus de chose a update, mettez le dans le body et faites un if
      if (userUpdate.username)
        user.username = userUpdate.username;
      if (userUpdate.avatar)
        user.avatar = userUpdate.avatar
      return await this.usersRepository.save(user);
    }
    return 'There is no user to update';
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({
      id: id,
    })
    if (!user)
      return ('Cant delete an inexistant user');
    this.usersRepository.delete(id);
    return `This action removes a #${id} user`;
  }

  async setAvatar(id: number, username: string, file: any) {
    const user = await this.usersRepository.findOneBy({
      id: id,
    })
    if (user)
    {
      user.avatar = file.filename;
      user.username = username;
      return await this.usersRepository.save(user);
    }
    return ('User not found');
  }

  //ID est le user actuel, friend est le user a ajouter de type User
  //On push dans le tableau le user friend et on save user qui a été changé dans userRepository
  async addFriend(id: number, friend: User): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      user.friends.push(friend);
      return await this.usersRepository.save(user);
    }
    return (null);
  }

  async addFriendById(id: number, friendId: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      relations: {
        friends: true,
      },
      where: { id: id }
    });
    const friend = await this.usersRepository.findOne({ where: { id: friendId } });
    if (user && friend && id != friendId) {
      if (!user.friends) {
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

  async removeFriend(id: number, friend: User) {
    const user = await this.usersRepository.findOneBy({ id: id });
    return user;
  }

  async removeFriendById(id: number, friendId: number) {
    const user = await this.usersRepository.findOneBy({ id: id });
    const friend = await this.usersRepository.findOneBy({ id: friendId });
    return user;
  }

  async getResults(id: number): Promise<Results[]> {
    const user = await this.usersRepository.findOne({
      relations: {
        friends: true,
      },
      where: { id: id }
    });
    return user ? user.results : [];
  }
}