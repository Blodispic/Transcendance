import { Body, Controller, Post } from '@nestjs/common';
import { OauthService } from './oauth.service';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Post('token')
  async getToken(@Body() body: any) { 
     console.log(body);

      return this.oauthService.getToken(body.code);
  }
}
