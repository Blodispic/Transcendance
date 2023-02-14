import { Body, Controller, Post } from '@nestjs/common';
import { OauthService } from './Oauth.service';
import { getFileInfo } from 'prettier';
import { UserService } from 'src/user/user.service';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) { }

  @Post('token')
  async getToken(@Body() body: any) {
    return this.oauthService.getToken(body.code);
  }

}
