import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDTO } from './dtos/login.response.dto';
import { RegisterRequestDTO } from './dtos/register.request.dto';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { FacebookAuthGuard } from './guards/facebook.auth.guard';
import { AppleAuthGuard } from './guards/apple.auth.guard';
import { CheckTokenExpiryGuard } from './guards/check.token.expiry.guard';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // --- Email - Pass start ---
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: { email: string; password: string },
  ): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDTO,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }
  // --- Email - Pass end ---

  // --- Google start ---
  @Post('google')
  async loginWithGoogle(
    @Body() body: { accessToken: string },
  ): Promise<LoginResponseDTO | BadRequestException> {
    return await this.authService.loginWithGoogle(body.accessToken);
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthCallback(@Req() req, @Res() res) {
    const googleToken = req.user.accessToken;
    const googleRefreshToken = req.user.refreshToken;
    res.cookie('access_token', googleToken, { httpOnly: true });
    res.cookie('refresh_token', googleRefreshToken, {
      httpOnly: true,
    });
    res.redirect('http://localhost:3000/auth/google/profile');
  }

  @UseGuards(CheckTokenExpiryGuard)
  @Get('google/profile')
  async getGoogleProfile(@Req() req) {
    const accessToken = req.cookies['access_token'];
    if (accessToken) {
      return (await this.authService.getGoogleProfile(accessToken)).data;
    } else {
      throw new UnauthorizedException('No access token');
    }
  }

  @Get('google/logout')
  logout(@Req() req, @Res() res) {
    const refreshGoogleToken = req.cookies['refresh_token'];
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.authService.revokeGoogleToken(refreshGoogleToken);
    res.redirect('http://localhost:3000/');
  }
  // --- Google end ---

  // --- Facebook start ---
  @Post('facebook')
  async facebookAuth(
    @Body() body: { accessToken: string },
  ): Promise<LoginResponseDTO | BadRequestException> {
    return await this.authService.loginWithFacebook(body.accessToken);
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  facebookAuthCallback(@Req() req) {
    console.log(req.user);
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }
  // --- Facebook end ---

  // --- Apple start ---
  @Get('apple')
  async appleAuth(
    @Body() accessToken: string,
  ): Promise<LoginResponseDTO | BadRequestException> {
    throw new UnauthorizedException('TODO appleAuth');
  }

  @Get('apple/callback')
  @UseGuards(AppleAuthGuard)
  appleAuthCallback(@Req() req, @Res() res) {
    return res.redirect('/');
  }
  // --- Apple end ---
}
