import { Injectable } from "@nestjs/common";
import { Results } from "./entities/results.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class ResultService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async createResult(resultDto: Results) {
    const user1 = await this.userService.getByUsername(resultDto.winner);
    const user2 = await this.userService.getByUsername(resultDto.loser);
    if (user1)
    {
      resultDto.user = user1;
      if (!user1.results)
        user1.results = [];
      user1.results.push(resultDto);
      this.userService.save(user1);
    }
    else
      return ("winner doesn't exists");
    if (user2)
    {
      resultDto.user = user2;
      if (!user2.results)
        user2.results = [];
      user2.results.push(resultDto);
      this.userService.save(user2);
    }
    else
      return ("loser doesn't exists");
    return (resultDto);
  }
}
