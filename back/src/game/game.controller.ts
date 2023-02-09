import { Body, Controller, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';

export let user = [];

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) { }

    
    @Post(':id')
    GetRoomId(@Param('id') id: number) {
        console.log("controller of game");
        return (id);
    }

    // @Post('waiting')
    // matchmaking(@Body() client: any)
    // {
    //     user.push(client);
    // }
}

