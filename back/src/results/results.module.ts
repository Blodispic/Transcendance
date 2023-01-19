import { ResultController } from './results.controller';
import { ResultService } from './results.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    controllers: [ResultController,],
    providers: [ResultService,],
})
export class ResultModule { }
