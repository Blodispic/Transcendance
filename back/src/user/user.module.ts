import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Results } from '../results/entities/results.entity';
import { FriendRequest } from './entities/friend-request.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/Oauth/constants';
import { JwtStrategy } from 'src/Oauth/jwt.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Results, FriendRequest]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '900s' },
    }),
  ],
})
export class UserModule {}
