import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: 'YOUR_FACEBOOK_APP_ID',
      clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email'],
      passReqToCallback: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { email, displayName, photos } = profile;
    const user = await this.authService.findOrCreateUser(
      email,
      displayName,
      photos[0]?.value,
    );
    // done(null, user);
  }
}
