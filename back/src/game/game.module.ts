import { Module } from "@nestjs/common";
import { PongGateway } from "src/game/pong.gateway";
import { UserModule } from "src/user/user.module";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { FriendRequest } from "src/user/entities/friend-request.entity";
import { Results } from "src/results/entities/results.entity";
import { User } from "src/user/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([User, Results, FriendRequest]), UserModule],
  controllers: [GameController],
  providers: [GameService, PongGateway],
  exports: [GameService],
})
export class GameModule { }
