import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './auth/decorators/user.decorator';
import {AccessTokenPayload} from "./auth/types/AccessTokenPayload";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getCurrentEnv(): string {
    return this.appService.getCurrentEnvironment();
  }

  @Get()
  async getHello(@User() user): Promise<string> {
    return await this.appService.getHello(user.id);
  }

  // @Get()
  // async getHello(@Request() req): Promise<string> {
  //   const accessTokenPayload: AccessTokenPayload =
  //       req.user as AccessTokenPayload;
  //   return await this.appService.getHello(accessTokenPayload.userId);
  // }
}
