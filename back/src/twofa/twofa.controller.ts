import { Body, Controller, Post } from '@nestjs/common';
import { getFileInfo } from 'prettier';
import { UserService } from 'src/user/user.service';
import { TwoFaService } from './twofa.service';

@Controller('oauth')
export class TwoFaController {
  constructor(private readonly oauthService: TwoFaService) { }


  
  @Post('generate')
  @UseGuards(JwtAuthenticationGuard)
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
      const { otpauthUrl } = await this.TwoFaService.generateTwoFactorAuthenticationSecret(request.user);
      return this.TwoFaService.pipeQrCodeStream(response, otpauthUrl);
    }
}
