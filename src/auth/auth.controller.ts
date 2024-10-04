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
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dtos/login.request.dto';
import { SocialLoginRequestDto } from './dtos/social_login.request.dto';

@ApiTags('Auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // --- Email - Pass start ---
  @ApiBody({ type: LoginRequestDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginRequestDto,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @ApiBody({ type: RegisterRequestDTO })
  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDTO,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }
  // --- Email - Pass end ---

  // --- Google start ---
  @ApiBody({ type: SocialLoginRequestDto })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('google')
  async loginWithGoogle(
    @Body() body: SocialLoginRequestDto,
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
  async logout(@Req() req, @Res() res) {
    const refreshGoogleToken = req.cookies['refresh_token'];
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    await this.authService.revokeGoogleToken(refreshGoogleToken);
    res.redirect('http://localhost:3000/');
  }
  // --- Google end ---

  // --- Facebook start ---
  @ApiBody({ type: SocialLoginRequestDto })
  @Post('facebook')
  async facebookAuth(
    @Body() body: SocialLoginRequestDto,
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
  @ApiBody({ type: SocialLoginRequestDto })
  @Get('apple')
  async appleAuth(
    @Body() body: SocialLoginRequestDto,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return await this.authService.loginWithApple(body.accessToken);
  }

  @Get('apple/callback')
  @UseGuards(AppleAuthGuard)
  appleAuthCallback(@Req() req, @Res() res) {
    return res.redirect('/');
  }
  // --- Apple end ---
}
