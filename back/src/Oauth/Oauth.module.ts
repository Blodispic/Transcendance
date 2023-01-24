import { Module } from '@nestjs/common';
import { OauthController } from './Oauth.controller';
import { OauthService } from './Oauth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { FriendRequest } from 'src/user/entities/friend-request.entity';

@Module({
  controllers: [OauthController],
  providers: [OauthService],
  imports: [UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
    TypeOrmModule.forFeature([User, FriendRequest]),
  ],
})
export class OauthModule { }
