import { Body, Controller, Post } from '@nestjs/common';
import { OauthService } from './Oauth.service';
import { getFileInfo } from 'prettier';
import { UserService } from 'src/user/user.service';

@Controller('oauth')
export class OauthController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly userService: UserService,
  ) {}

  @Post('token')
  async getToken(@Body() body: any) { 
     console.log(body);

    const data = await this.oauthService.getToken(body.code);
    const token = await this.oauthService.getInfo(data.access_token);

    const user = { 
      username: token.login,
      email: token.email,
    }

    this.userService.create(user);
    

    console.log(data);
    
    return token;
  }

}
