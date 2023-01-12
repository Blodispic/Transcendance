import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './Oauth.controller';
import { UserService } from './Oauth.service';

@Module({
  controllers: [OauthController],
  providers: [OauthService],
  imports: [TypeOrmModule.forFeature([User])]
})
export class OauthModule { }
