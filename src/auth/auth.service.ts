import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/users/entities/user.entity';
import { RegisterRequestDTO } from './dtos/register.request.dto';
import * as bcrypt from 'bcryptjs';
import { LoginResponseDTO } from './dtos/login.response.dto';
import axios from 'axios';
import { LoginType } from '../enums/login-type.enum';
import { UserRole } from '../enums/user-role.enum';
import { Buffer } from 'buffer/';
import { plainToClass } from 'class-transformer';
import * as jwt from 'jsonwebtoken';
import { AppleJwtPayload } from './interfaces/apple.jwt.ayload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // --- Email - start ---
  async login(email: string, password: string): Promise<LoginResponseDTO> {
    const user = await this.validateUser(email, password);
    const accessToken = this.generateToken(user);
    return {
      accessToken,
      user: plainToClass(User, user),
    };
  }

  async register(user: RegisterRequestDTO): Promise<LoginResponseDTO> {
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUserData = { ...user, password: hashedPassword };
    const newUser = await this.usersService.create(newUserData);
    const accessToken = this.generateToken(newUser);
    return {
      accessToken,
      user: plainToClass(User, newUser),
    };
  }
  // --- Email - end ---

  // --- Google - start ---
  async loginWithGoogle(
    googleAccessToken: string,
  ): Promise<LoginResponseDTO | BadRequestException> {
    const googleProfile = await this.getGoogleProfile(googleAccessToken);
    if (googleProfile) {
      let userDb = await this.usersService.findOneByEmail(
        googleProfile.data.email,
      );
      if (!userDb) {
        userDb = await this.usersService.create({
          name: googleProfile.data.name,
          email: googleProfile.data.email,
          avatarUrl: googleProfile.data.picture,
          loginType: LoginType.GOOGLE,
          role: UserRole.USER,
        });
      }
      const accessToken = this.generateToken(userDb);
      return {
        accessToken,
        user: plainToClass(User, userDb),
      };
    } else {
      throw new BadRequestException('Failed to revoke the google info');
    }
  }

  async getNewGoogleAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://accounts.google.com/o/oauth2/token',
        {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      );
      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to refresh the access token.');
    }
  }

  async getGoogleProfile(accessToken: string) {
    try {
      return axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }

  async isGoogleTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );
      const expiresIn = response.data.expires_in;
      if (!expiresIn || expiresIn <= 0) {
        return true;
      }
    } catch (error) {
      return true;
    }
  }

  async revokeGoogleToken(token: string) {
    try {
      await axios.get(
        `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }
  // --- Google - end ---

  // --- Facebook - start ---
  async loginWithFacebook(
    facebookAccessToken: string,
  ): Promise<LoginResponseDTO | BadRequestException> {
    const facebookProfile = await this.getFacebookProfile(facebookAccessToken);
    if (facebookProfile) {
      let userDb = await this.usersService.findOneByEmail(
        facebookProfile.data.email,
      );
      if (!userDb) {
        const name = Buffer.from(facebookProfile.data.name, 'utf-8').toString(
          'utf-8',
        );
        userDb = await this.usersService.create({
          name: name,
          email: facebookProfile.data.email,
          avatarUrl: facebookProfile.data.picture.data.url,
          loginType: LoginType.FACEBOOK,
          role: UserRole.USER,
        });
      }
      const accessToken = this.generateToken(userDb);
      return {
        accessToken,
        user: plainToClass(User, userDb),
      };
    } else {
      throw new BadRequestException('Failed to revoke the google info');
    }
  }

  async getFacebookProfile(accessToken: string) {
    try {
      return axios.get(
        `https://graph.facebook.com/me?fields=email,name,picture.type(large)&access_token=${accessToken}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }

  //  --- Facebook - end ---

  // --- Apple - start ---
  async loginWithApple(idToken: string): Promise<LoginResponseDTO> {
    const userInfo = await this.decodeIdToken(idToken);
    let userDb = await this.usersService.findOneByEmail(userInfo.email);
    if (!userDb) {
      userDb = await this.usersService.create({
        name: `${userInfo.name.firstName} ${userInfo.name.lastName}`,
        email: userInfo.email,
        avatarUrl: '',
        loginType: LoginType.APPLE,
        role: UserRole.USER,
      });
    }
    const accessToken = this.generateToken(userDb);
    return {
      accessToken,
      user: plainToClass(User, userDb),
    };
  }

  private async getApplePublicKeys() {
    const response = await axios.get('https://appleid.apple.com/auth/keys');
    return response.data.keys;
  }

  private async decodeIdToken(idToken: string) {
    const publicKeys = await this.getApplePublicKeys();
    const decodedHeader = jwt.decode(idToken, { complete: true }) as any;

    if (!decodedHeader) {
      throw new UnauthorizedException('Invalid ID token');
    }

    const kid = decodedHeader.header.kid;
    const publicKey = publicKeys.find((key) => key.kid === kid);

    if (!publicKey) {
      throw new UnauthorizedException('Public key not found');
    }

    const key = jwt.sign({ alg: 'RS256', ...publicKey }, '', {
      algorithm: 'RS256',
    });

    try {
      const decodedToken = jwt.verify(idToken, key, {
        algorithms: ['RS256'],
        audience: process.env.APPLE_CLIENT_ID,
        issuer: 'https://appleid.apple.com',
      }) as AppleJwtPayload;

      // Extract email and name from the decoded token
      const email = decodedToken.email;
      const name = decodedToken.name;

      return { email, name };
    } catch (error) {
      throw new Error('Invalid ID Token');
    }
  }
  // --- Apple - end ---

  // Helper
  public async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  private generateToken(user: User): string {
    const payload = { email: user.email, id: user.id };
    return this.jwtService.sign(payload);
  }
}
