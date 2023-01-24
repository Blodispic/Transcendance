import { Module } from '@nestjs/common';
import { OauthController } from './Oauth.controller';
import { OauthService } from './Oauth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  controllers: [OauthController],
  providers: [OauthService],
  imports: [UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),],
})
export class OauthModule { }
