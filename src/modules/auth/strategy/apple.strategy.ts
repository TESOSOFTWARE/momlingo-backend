/*
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-apple';
import { AuthService } from '../auth.service';
import { Buffer } from 'buffer';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(private authService: AuthService) {
    super({
      clientID: 'YOUR_APPLE_CLIENT_ID',
      teamID: 'YOUR_APPLE_TEAM_ID',
      keyID: 'YOUR_APPLE_KEY_ID',
      privateKey: 'YOUR_APPLE_PRIVATE_KEY',
      callbackURL: 'http://localhost:3000/auth/apple/callback',
    });
  }

  async validate(accessToken: string, idToken: string, done: VerifyCallback) {
    const payload = this.decodeIdToken(idToken); // Custom method to decode the ID token
    const { email, name } = payload; // Extract email and name from the payload

    const user = await this.authService.findOrCreateUser(email, name);
    done(null, user);
  }

  private decodeIdToken(idToken: string) {
    const buffer = Buffer.from(idToken.split('.')[1], 'base64');
    return JSON.parse(buffer.toString());
  }
}
*/
