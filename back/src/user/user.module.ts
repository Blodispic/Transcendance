import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Results } from '../results/entities/results.entity';
import { FriendRequest } from './entities/friend-request.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/Oauth/constants';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User, Results, FriendRequest]),
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '900s' },
  }),
  ],
})
export class UserModule { }
