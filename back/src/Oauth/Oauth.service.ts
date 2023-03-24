import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';
import { userList } from '../app.gateway'

@Injectable()
export class OauthService {

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  async getToken(oauthCode: string): Promise<any> {
    const api_key = process.env.API42_UID;
    const private_key = process.env.API42_SECRET;
    const redirect_uri = process.env.REDIRECT_URI;
    
    const body = {
      grant_type: "authorization_code",
      client_id: api_key,
      client_secret: private_key,
      code: oauthCode,
      redirect_uri: redirect_uri,
    };

    const response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
      
    });
    const data = await response.json();

    if (!data.access_token) {
      throw new HttpException(`AuthService getToken failed, HTTP status ${response.status}`, HttpStatus.BAD_REQUEST);
    } else
      return this.getInfo(data.access_token);
  }

  async getInfo(intra_token: string) {

    
    const response = await fetch('https://api.intra.42.fr/v2/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${intra_token}`,
      },
    });
    
    const data = await response.json();
    const user = await this.usersService.getByLogin(data.login);
    const payload = { username: data.login, }
    const access_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: '3600s',
    });
    if (user)
    {
      for (const iterator of userList) {
        if (iterator.handshake.auth.user.id === user.id)
          throw new BadRequestException("t'as deja un tab frero");
      }
      await this.usersService.save(user);
      return ({user, access_token});
    }
    if (data.error)
      return (data.error);
    const userDto: CreateUserDto = {
      login: data.login,
      email: data.email,
      intra_avatar: data.image.link,
    }
    const realUser = await this.usersService.create(userDto);
    return ( {user: realUser, access_token});
  }
}
