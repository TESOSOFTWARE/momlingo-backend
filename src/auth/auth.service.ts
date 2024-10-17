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
import * as jwt from 'jsonwebtoken';
import { AppleJwtPayload } from './interfaces/apple.jwt.ayload';
import { UserWithChildren } from '../models/users/interfaces/user-with-children.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // --- Email - start ---
  async login(email: string, password: string): Promise<LoginResponseDTO> {
    const userWithChildren = await this.validateUser(email, password);
    const accessToken = this.generateToken(userWithChildren);
    return {
      accessToken,
      user: userWithChildren,
    };
  }

  async register(user: RegisterRequestDTO): Promise<LoginResponseDTO> {
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUserData = { ...user, password: hashedPassword };
    const userWithChildren = await this.usersService.create(newUserData);
    const accessToken = this.generateToken(await userWithChildren);
    return {
      accessToken,
      user: userWithChildren,
    };
  }
  // --- Email - end ---

  // --- Google - start ---
  async loginWithGoogle(
    googleAccessToken: string,
  ): Promise<LoginResponseDTO | BadRequestException> {
    const googleProfile = await this.getGoogleProfile(googleAccessToken);
    if (googleProfile) {
      const user = await this.usersService.findOneByEmail(
        googleProfile.data.email,
      );
      let userWithChildren;
      if (user != null) {
        userWithChildren =
          await this.usersService.findUserWithPartnerAndChildrenByEmail(
            googleProfile.data.email,
          );
      } else {
        const name = Buffer.from(googleProfile.data.name, 'utf-8').toString(
          'utf-8',
        );
        userWithChildren = await this.usersService.create({
          name: name,
          email: googleProfile.data.email,
          avatarUrl: googleProfile.data.picture,
          loginType: LoginType.GOOGLE,
          role: UserRole.USER,
        });
      }
      const accessToken = this.generateToken(userWithChildren);
      return {
        accessToken,
        user: userWithChildren,
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
      const user = await this.usersService.findOneByEmail(
        facebookProfile.data.email,
      );
      let userWithChildren;
      if (user != null) {
        userWithChildren =
          await this.usersService.findUserWithPartnerAndChildrenByEmail(
            facebookProfile.data.email,
          );
      } else {
        const name = Buffer.from(facebookProfile.data.name, 'utf-8').toString(
          'utf-8',
        );
        userWithChildren = await this.usersService.create({
          name: name,
          email: facebookProfile.data.email,
          avatarUrl: facebookProfile.data.picture.data.url,
          loginType: LoginType.FACEBOOK,
          role: UserRole.USER,
        });
      }

      const accessToken = this.generateToken(userWithChildren);
      return {
        accessToken,
        user: userWithChildren,
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
    const user = await this.usersService.findOneByEmail(userInfo.email);
    let userWithChildren;
    if (user != null) {
      userWithChildren =
        await this.usersService.findUserWithPartnerAndChildrenByEmail(
          userInfo.email,
        );
    } else {
      const name = Buffer.from(
        `${userInfo.name.firstName} ${userInfo.name.lastName}`,
        'utf-8',
      ).toString('utf-8');
      userWithChildren = await this.usersService.create({
        name: name,
        email: userInfo.email,
        avatarUrl: '',
        loginType: LoginType.APPLE,
        role: UserRole.USER,
      });
    }

    const accessToken = this.generateToken(userWithChildren);
    return {
      accessToken,
      user: userWithChildren,
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
  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithChildren> {
    const userWithChildren: UserWithChildren =
      await this.usersService.findUserWithPartnerAndChildrenByEmail(email);
    if (!userWithChildren) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(
      password,
      userWithChildren.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return userWithChildren;
  }

  async validateUserById(id: number): Promise<User | null> {
    return this.usersService.findOneById(id);
  }

  private generateToken(userWithChildren: UserWithChildren): string {
    const payload = { email: userWithChildren.email, id: userWithChildren.id };
    return this.jwtService.sign(payload);
  }
}
