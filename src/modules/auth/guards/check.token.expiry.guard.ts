import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class CheckTokenExpiryGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['access_token'];

    console.log(`accessToken : ${accessToken}`);
    if (await this.authService.isGoogleTokenExpired(accessToken)) {
      const refreshToken = request.cookies['refresh_token'];

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      try {
        const newAccessToken =
          await this.authService.getNewGoogleAccessToken(refreshToken);
        request.res.cookie('access_token', newAccessToken, {
          httpOnly: true,
        });
        console.log(`newAccessToken : ${newAccessToken}`);
        request.cookies['access_token'] = newAccessToken;
      } catch (error) {
        throw new UnauthorizedException('Failed to refresh token');
      }
    }

    return true;
  }
}