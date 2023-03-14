import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { OauthModule } from './Oauth/Oauth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';
import { AppGateway } from './app.gateway';
import { MulterModule } from '@nestjs/platform-express';
import { Results } from './results/entities/results.entity';
import { ChannelModule } from './chat/channel/channel.module';
import { ResultModule } from './results/results.module';
import { Channel } from './chat/channel/entities/channel.entity';
import { FriendRequest } from './user/entities/friend-request.entity';
import { UserService } from './user/user.service';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GatewayExceptionFilter } from './app.exceptionFilter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'PostgreSQL',
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
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, AppGateway,
    {
      provide: APP_INTERCEPTOR,
		  useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule { }
