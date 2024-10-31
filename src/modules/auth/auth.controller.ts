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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dtos/login.request.dto';
import { SocialLoginRequestDto } from './dtos/social_login.request.dto';

@ApiTags('Auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // --- Email - Pass start ---
  @Post('login')
  @ApiBody({ type: LoginRequestDto })
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Đăng nhập với email - password. Dành cho Admin',
  })
  async login(
    @Body() loginDto: LoginRequestDto,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  @ApiBody({ type: RegisterRequestDTO })
  @ApiOperation({
    summary: 'Đăng ký tài khoản với email - password. Dành cho Admin',
  })
  async register(
    @Body() registerBody: RegisterRequestDTO,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }
  // --- Email - Pass end ---

  // --- Google start ---
  @Post('google')
  @ApiBody({ type: SocialLoginRequestDto })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({
    summary: 'Đăng nhập Gmail qua API',
  })
  async loginWithGoogle(
    @Body() body: SocialLoginRequestDto,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return await this.authService.loginWithGoogle(body.accessToken);
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Đăng nhập qua Gmail trên Web',
  })
  googleAuthCallback(@Req() req, @Res() res) {
    try {
      const googleToken = req.user.accessToken;
      const googleRefreshToken = req.user.refreshToken;
      res.cookie('access_token', googleToken, { httpOnly: true });
      res.cookie('refresh_token', googleRefreshToken, {
        httpOnly: true,
      });
      res.redirect('/auth/google/profile');
    } catch (e) {
      console.log('Error GET google/callback', e);
      throw new UnauthorizedException('Error GET google/callback');
    }
  }

  @UseGuards(CheckTokenExpiryGuard)
  @Get('google/profile')
  @ApiOperation({
    summary: 'Trả về thông tin của Gmail profile sau khi đăng nhập trên Web',
  })
  async getGoogleProfile(@Req() req) {
    try {
      const accessToken = req.cookies['access_token'];
      if (accessToken) {
        return (await this.authService.getGoogleProfile(accessToken)).data;
      } else {
        throw new UnauthorizedException('No access token');
      }
    } catch (e) {
      console.log('Error GET google/profile', e);
      throw new UnauthorizedException('Error GET google/profile');
    }
  }

  @Get('google/logout')
  @ApiOperation({
    summary: 'Đăng xuất Gmail sau khi đăng nhập trên Web',
  })
  async logout(@Req() req, @Res() res) {
    try {
      const refreshGoogleToken = req.cookies['refresh_token'];
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      await this.authService.revokeGoogleToken(refreshGoogleToken);
      res.redirect('/');
    } catch (e) {
      console.log('Error GET google/logout', e);
      throw new UnauthorizedException('Error GET google/logout');
    }
  }
  // --- Google end ---

  // --- Facebook start ---
  @Post('facebook')
  @ApiBody({ type: SocialLoginRequestDto })
  @ApiOperation({
    summary: 'Đăng nhập Facebook qua API',
  })
  async facebookAuth(
    @Body() body: SocialLoginRequestDto,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return await this.authService.loginWithFacebook(body.accessToken);
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({
    summary: 'Đăng nhập qua Facebook dành cho Web',
  })
  facebookAuthCallback(@Req() req) {
    try {
      console.log(req.user);
      return {
        statusCode: HttpStatus.OK,
        data: req.user,
      };
    } catch (e) {
      console.log('Error GET facebook/callback', e);
      throw new UnauthorizedException('Error GET facebook/callback');
    }
  }
  // --- Facebook end ---

  // --- Apple start ---
  @Get('apple')
  @ApiBody({ type: SocialLoginRequestDto })
  @ApiOperation({
    summary: 'Đăng nhập qua Apple qua API',
  })
  async appleAuth(
    @Body() body: SocialLoginRequestDto,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return await this.authService.loginWithApple(body.accessToken);
  }

  @Get('apple/callback')
  @UseGuards(AppleAuthGuard)
  @ApiOperation({
    summary: 'Đăng nhập qua Apple cho Web',
  })
  appleAuthCallback(@Req() req, @Res() res) {
    return res.redirect('/');
  }
  // --- Apple end ---
}
