import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
 
@Injectable()
export class TwoFaService {
  constructor (
    private readonly twofaservice: TwoFaService,
    // private readonly configService: ConfigService
  ) {}
  
  async turnOnTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true
    });
  }
}