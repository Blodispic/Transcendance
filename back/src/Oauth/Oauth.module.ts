import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';

@Module({
  controllers: [OauthController],
  providers: [OauthService],
  imports: [UserModule],
})
export class OauthModule {}
