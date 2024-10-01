import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDTO } from './dtos/login.response.dto';
import { RegisterRequestDTO } from './dtos/register.request.dto';
import { RegisterResponseDTO } from './dtos/register.response.dto';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { FacebookAuthGuard } from './guards/facebook.auth.guard';
import { AppleAuthGuard } from './guards/apple.auth.guard';

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
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthCallback(@Req() req, @Res() res) {
    // Successful authentication, redirect or send response
    // TODO with web Google
    return res.redirect('/');
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth(
    @Body() accessToken: string,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    // Initiates the Facebook OAuth flow
    // return await this.authService.loginWithFacebook(req);
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
    // Initiates the Apple OAuth flow
  }

  @Get('apple/callback')
  @UseGuards(AppleAuthGuard)
  appleAuthCallback(@Req() req, @Res() res) {
    // Successful authentication, redirect or send response
    // TODO with web login Apple
    return res.redirect('/');
  }
}
