import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [OauthController],
  providers: [OauthService],
  imports: [UserModule],
})
export class OauthModule {}
