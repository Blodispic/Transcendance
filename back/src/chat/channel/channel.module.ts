import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { Channel } from './entities/channel.entity';


@Module({
  controllers: [ChannelController],
  providers: [ChannelService],
  imports: [TypeOrmModule.forFeature([Channel]), UserModule],
  exports: [ChannelService],
})
export class ChannelModule {}
