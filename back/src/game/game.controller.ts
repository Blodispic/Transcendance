import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtGuard } from 'src/Oauth/jwt-auth.guard';

export const user = [];

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) { }


    @Post(':id')
    @UseGuards(JwtGuard)
    GetRoomId(@Param('id') id: number) {
        return (id);
    }

}

