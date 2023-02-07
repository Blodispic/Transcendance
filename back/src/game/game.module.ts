import { Module } from "@nestjs/common";
import { PongGateway } from "src/game/pong.gateway";
import { UserModule } from "src/user/user.module";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";

@Module({
  controllers: [GameController],
  imports: [UserModule],
  providers: [GameService, PongGateway],
  exports: [GameService],
  })
  export class GameModule { }
  