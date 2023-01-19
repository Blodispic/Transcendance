import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { ChannelModule } from './chat/channel/channel.module';
import { OauthModule } from './oauth/oauth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';
import { Channel } from './chat/channel/entities/channel.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      entities: [User, Channel],
      synchronize: true,
      // dropSchema: true,    //A ENLEVER QUAND PLUS BESOIN (ça reset la db a chaque changement)
    }),
    ConfigModule.forRoot(),
    UserModule,
    OauthModule,
    ChannelModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}

