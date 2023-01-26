import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class OauthService {

  constructor(
    private usersService: UserService,
    private jwtService: JwtService
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

    console.log(body);

    const response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    // if (!response.ok) {
    //   throw new Error(`AuthService getToken failed, HTTP status ${response.status}`);
    // }
    const data = await response.json();
    console.log(data);

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

    // console.log(data);

    const user = await this.usersService.getByLogin(data.login);

    // console.log(user);

    if (user)
      return (user);
    if (data.error)
      return (data.error);

    const payload = { username: data.login }
    const token = await this.jwtService.sign(payload);

    const userDto: CreateUserDto = {
      username: data.login,
      login: data.login,
      email: data.email,
      intra_avatar: data.image.link,
      access_token: token
    }
    return await this.usersService.create(userDto);
  }
}


