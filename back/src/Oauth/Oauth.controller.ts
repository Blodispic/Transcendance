import { Body, Controller, Post } from '@nestjs/common';
import { OauthService } from './Oauth.service';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) { }

  @Post('token')
  async getToken(@Body() body: { code: string }) {
    return this.oauthService.getToken(body.code);
  }

}
