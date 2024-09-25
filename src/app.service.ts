import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getCurrentEnvironment() {
    const env = this.configService.get<string>('NODE_ENV');
    return env || 'development'; // Trả về 'development' nếu không có giá trị
  }
}
