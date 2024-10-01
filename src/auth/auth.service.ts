import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/users/entities/user.entity';
import { RegisterRequestDTO } from './dtos/register.request.dto';
import * as bcrypt from 'bcryptjs';
import { LoginResponseDTO } from './dtos/login.response.dto';
import axios from 'axios';
import { LoginType } from '../enums/login-type.enum';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDTO> {
    const user = await this.validateUser(email, password);
    const accessToken = this.generateToken(user);
    return {
      accessToken,
      user,
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
      user: newUser,
    };
  }

  async loginWithFacebook(
    email: string,
    password: string,
  ): Promise<LoginResponseDTO> {
    const user = await this.validateUser(email, password);
    const accessToken = this.generateToken(user);
    return {
      accessToken,
      user,
    };
  }

  async loginWithApple(
    email: string,
    password: string,
  ): Promise<LoginResponseDTO> {
    const user = await this.validateUser(email, password);
    const accessToken = this.generateToken(user);
    return {
      accessToken,
      user,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
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

  generateToken(user: User): string {
    const payload = { email: user.email, id: user.id };
    return this.jwtService.sign(payload);
  }

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
        user: userDb,
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
}
