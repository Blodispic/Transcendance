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

  async getInfo(token: string) {
    const response = await fetch('https://api.intra.42.fr/v2/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    
    const user = await this.usersService.getByUsername(data.login);
    console.log(data);
    console.log(data.login);
    console.log(data.email);
    console.log(user);
    
    if (user)
      return (user);
    if (data.error)
      return (data.error);
    const userReturn = {
      "username": data.login,
      "email": data.email,
      "status": "online",
      "elo": 1000,
      "avatar": data.image,
    }

    await this.usersService.create(userReturn)
  
    return userReturn;
    

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
  }
}


