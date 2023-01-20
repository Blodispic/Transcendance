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
import { Results } from './results/entities/results.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      entities: [User, Results],
      synchronize: true,
      //dropSchema: true,    //A ENLEVER QUAND PLUS BESOIN (ça reset la db a chaque changement)
    }),
    MulterModule.register({
      dest: './files',
    }),
    ConfigModule.forRoot(),
    OauthModule,
    ResultModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
