import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDTO } from './dtos/login.response.dto';
import { RegisterRequestDTO } from './dtos/register.request.dto';
import { RegisterResponseDTO } from './dtos/register.response.dto';
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
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(
    @Body() accessToken: string,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    throw new UnauthorizedException('TODO googleAuth');
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

    res.redirect('http://localhost:3000/auth/profile');
  }

  @UseGuards(CheckTokenExpiryGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const accessToken = req.cookies['access_token'];
    if (accessToken)
      return (await this.authService.getProfile(accessToken)).data;
    throw new UnauthorizedException('No access token');
  }

  @Get('logout')
  logout(@Req() req, @Res() res) {
    const refreshToken = req.cookies['refresh_token'];
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.authService.revokeGoogleToken(refreshToken);
    res.redirect('http://localhost:3000/');
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth(
    @Body() accessToken: string,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    throw new UnauthorizedException('TODO facebookAuth');
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  facebookAuthCallback(@Req() req, @Res() res) {
    // Successful authentication, redirect or send response
    // TODO with web login Facebook
    return res.redirect('/');
  }

  @Get('apple')
  @UseGuards(AppleAuthGuard)
  async appleAuth(
    @Body() accessToken: string,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    throw new UnauthorizedException('TODO appleAuth');
  }

  @Get('apple/callback')
  @UseGuards(AppleAuthGuard)
  appleAuthCallback(@Req() req, @Res() res) {
    // Successful authentication, redirect or send response
    // TODO with web login Apple
    return res.redirect('/');
  }
}
