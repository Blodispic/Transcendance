import { Module } from '@nestjs/common';
import { OauthController } from './Oauth.controller';
import { OauthService } from './Oauth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [OauthController],
  providers: [OauthService],
  imports: [UserModule],
})
export class OauthModule {}
