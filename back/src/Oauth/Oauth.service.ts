import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class OauthService {

  constructor(private usersService: UserService) { }

  async validateUser(username: string): Promise<any> {
    const user = await this.usersService.getByUsername(username);
    if (user) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async getToken(oauthCode: string): Promise<any> {
    console.log("test");
    const api_key = process.env.API42_UID;
    const private_key = process.env.API42_SECRET;
    const redirect_uri = process.env.REDIRECT_URI;

    console.log("est");

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
    return this.getInfo(data.access_token);

  }

  async getInfo(token: string) {
    const response = await fetch('https://api.intra.42.fr/v2/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    
    const user = await this.usersService.getByUsername(data.login)
    
    if (user)
      return (user);

    // }
    //Creation nouveau user

    // will replace data with user and send user from info in data
    //Create a user with the new data, cf: image on discord
    // Need to create username (login: )
    // Need to create elo with a base of ? (1000?, 0?), we probably will take it from a define
    // Need to create avatar that will take a link (image: )
    // Friend vide
    // History vide 

    //Sinon
    //return await user = findonebyid

    return data
  }
}


