import { Module } from "@nestjs/common";
import { PongGateway } from "src/game/pong.gateway";
import { GameService } from "./game.services";

@Module({
    providers: [GameService, PongGateway],
    exports: [GameService]
  })
  export class GameModule { }
  