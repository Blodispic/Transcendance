import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Results } from "src/results/entities/results.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UpdateUserDto } from "../user/dto/update-user.dto";
import { User } from "./entities/user.entity";
import { FriendRequest } from "./entities/friend-request.entity";
import { FriendRequestDto } from "./dto/friend-request.dto";
import { JwtService } from "@nestjs/jwt";
import { CreateResultDto } from "src/results/dto/create-result.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Results)
    private readonly resultsRepository: Repository<Results>,
    private jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const check = await this.usersRepository.findOneBy({
      login: createUserDto.login
    })
    if (check)
      return (check);
    const user: User = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async createResults(createResultDto: CreateResultDto): Promise<Results> {
    const check = await this.resultsRepository.findOneBy({
      winner: createResultDto.winner
    })
    if (check)
      return (check);
    const result: Results = this.resultsRepository.create(createResultDto);
    return this.resultsRepository.save(result);
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

  async GetByAccessToken(access_token: any) {
      console.log("check token");
      const decoded_access_token: any = await this.jwtService.decode(access_token.token, { json: true });
      const user = await this.usersRepository.findOneBy({ login: decoded_access_token.username });
      if (user)
        return user;
      return {message: "Token user not found"};
  }

  async getByUsername(username: string) {
    const userfindName = await this.usersRepository.findOneBy({
      username: username
    })
    console.log("ici Back ", userfindName);
    return userfindName;
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
    if (user) {
      user.avatar = file.filename;
      user.username = username;
      return await this.usersRepository.save(user);
    }
    return ('User not found');
  }

  async sendFriendRequest(friendId: number, creator: User) {
    if (friendId == creator.id) {
      return ({message:"You can't add yourself"});
    }
    const friend: User | null = await this.usersRepository.findOne({
      relations: {
        friends: true,
      },
      where: { id: friendId }
    });
    if (!friend) {
      return ({message:'Friend does not exist'});
    }

    const user: User | null = await this.usersRepository.findOne({
      relations: {
        friends: true,
      },
      where: { id: creator.id }
    });
    if (!user) {
      return ({message:'User does not exist'});
    }
    const existingRequest = await this.friendRequestRepository.findOne({
      relations: {
        creator: true,
        receiver: true,
      },
      where: [{ creator: creator }, { receiver: friend }]
    });

    if (existingRequest) {
      return {message: "Friend request already sent"};
    }
    const friendRequest: FriendRequestDto = {
      creator: creator,
      receiver: friend,
      status: 'Pending'
    }
    
    await this.friendRequestRepository.save(friendRequest);
    const frienRequestPush: FriendRequest | null = await this.friendRequestRepository.findOne({
      where: [{ creator: creator }, { receiver: friend }]
    });
    // console.log(friend);
    if (frienRequestPush)
    {
      if (!friend.receiveFriendRequests)
        friend.receiveFriendRequests = [];
      friend.receiveFriendRequests.push(frienRequestPush);
      await this.usersRepository.save(friend);
      if (!user.sendFriendRequests)
        user.sendFriendRequests = [];
      user.sendFriendRequests.push(frienRequestPush);
      await this.usersRepository.save(user);
    }
    return {message: "Friend request sent"};
  }

  async GetFriendRequestStatus(friendId: number, creator: User) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: [{ creator: creator }, { receiver: { id: friendId } }]
    });
    console.log(friendId);
    if (!friendRequest) {
      return {message: "Friend request does not exist"};
    }
    return {status: friendRequest.status};
  }

  async GetFriendsRequest(user: User) {
    const receiver = await this.usersRepository.findOne({
      relations: {
        receiveFriendRequests: true,
      },
      where: { id: user.id }
    })
    if (receiver)
      return (receiver.receiveFriendRequests);
  }


  //ID est le user actuel, friend est le user a ajouter de type User
  //On push dans le tableau le user friend et on save user qui a été changé dans userRepository
  async addFriend(friendId: number, user: User): Promise<User | null> {
    const friend = await this.usersRepository.findOne({ where: { id: friendId } });
    if (friend) {
      friend.friends.push(user);
      user.friends.push(friend);
      this.usersRepository.save(user)
      return await this.usersRepository.save(friend);
    }
    return (null);
  }

  async addFriendById(friendId: number, id: number): Promise<User | null> {
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
