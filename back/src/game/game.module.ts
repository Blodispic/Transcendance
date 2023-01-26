import { Module } from "@nestjs/common";
import { PongGateway } from "src/game/pong.gateway";
import { UserModule } from "src/user/user.module";
import { GameService } from "./game.service";

@Module({
  imports: [UserModule],
  providers: [GameService, PongGateway],
  exports: [GameService],
  })
  export class GameModule { }
  