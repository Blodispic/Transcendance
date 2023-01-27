import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { OauthModule } from './oauth/oauth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';
import { AppGateway } from './app.gateway';
import { MulterModule } from '@nestjs/platform-express';
import { Results } from './results/entities/results.entity';
import { ChannelModule } from './chat/channel/channel.module';
import { ResultModule } from './results/results.module';
import { Channel } from './chat/channel/entities/channel.entity';
import { FriendRequest } from './user/entities/friend-request.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      entities: [User, Results, Channel, FriendRequest],
      synchronize: true,
      dropSchema: true,    //A ENLEVER QUAND PLUS BESOIN (ça reset la db a chaque changement)
    }),
    MulterModule.register({
      dest: './storage/images',
    }),
    ConfigModule.forRoot(),
    UserModule,
    GameModule,
    OauthModule,
    ChannelModule,
    ResultModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, AppGateway],
})
export class AppModule { }
