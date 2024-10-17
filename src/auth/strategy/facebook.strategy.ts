import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { Buffer } from 'buffer';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3000/api/v1/auth/facebook/callback',
      // profileFields: ['displayName', 'email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile, // undefined
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    console.log(`accessToken: ${accessToken}`);
    const facebookProfile =
      await this.authService.getFacebookProfile(accessToken);
    if (facebookProfile) {
      const name = Buffer.from(facebookProfile.data.name, 'utf-8').toString(
        'utf-8',
      );
      const user = {
        email: facebookProfile.data.email,
        name: name,
        avatarUrl: facebookProfile.data.picture.data.url,
      };
      const payload = {
        user,
        accessToken,
      };

      done(null, payload);
    }
  }
}
