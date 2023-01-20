import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultController } from './results.controller';
import { ResultService } from './results.service';
import { Module } from '@nestjs/common';
import { Results } from './entities/results.entity';

@Module({
    controllers: [ResultController,],
    providers: [ResultService,],
    imports: [TypeOrmModule.forFeature([Results])],
})
export class ResultModule { }
