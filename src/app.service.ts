import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from './modules/user/entities/user.entity';
import { UsersService } from './modules/user/users.service';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async getHello(userId: number): Promise<string> {
    const user: User = await this.usersService.findOneById(userId);
    return `Hello ${user.name}!`;
  }

  getCurrentEnvironment() {
    const env = this.configService.get<string>('NODE_ENV');
    return env || 'dev'; // Trả về 'dev' nếu không có giá trị
  }
}
