import { ResultModule } from './results/results.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { OauthModule } from './Oauth/Oauth.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ResultModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      entities: [User],
      synchronize: true,
      dropSchema: true,    //A ENLEVER QUAND PLUS BESOIN (ça reset la db a chaque changement)
    }),
    MulterModule.register({
      dest: './files',
    }),
    ConfigModule.forRoot(),
    UserModule,
    OauthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
