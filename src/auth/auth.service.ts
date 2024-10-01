import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/users/entities/user.entity';
import { RegisterRequestDTO } from './dtos/register.request.dto';
import * as bcrypt from 'bcryptjs';
import { LoginResponseDTO } from './dtos/login.response.dto';

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
      user: { id: user.id, name: user.name, email: user.email },
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
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    };
  }

  async loginWithGoogle(
    email: string,
    password: string,
  ): Promise<LoginResponseDTO> {
    const user = await this.validateUser(email, password);
    const accessToken = this.generateToken(user);
    return {
      accessToken,
      user: { id: user.id, name: user.name, email: user.email },
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
      user: { id: user.id, name: user.name, email: user.email },
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
      user: { id: user.id, name: user.name, email: user.email },
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

  async findOrCreateUser(
    email: string,
    name: string,
    picture?: string,
  ): Promise<User> {
    let user = await this.usersService.findOneByEmail(email);
    if (!user) {
      user = await this.usersService.create(user);
    }
    return user;
  }

  generateToken(user: User): string {
    const payload = { email: user.email, id: user.id };
    return this.jwtService.sign(payload);
  }
}
