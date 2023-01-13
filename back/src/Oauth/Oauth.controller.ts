import { Body, Controller, Post } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { getFileInfo } from 'prettier';

@Controller('Oauth')
export class OauthController {
  constructor(private readonly OauthService: OauthService) {}

  @Post('token')
  async getToken(@Body() body: any) {
    return body;

  }
}
