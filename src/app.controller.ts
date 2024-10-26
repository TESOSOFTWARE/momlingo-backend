import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Mặc định, trả về thông tin môi trường đang chạy',
  })
  getCurrentEnv(): string {
    return this.appService.getCurrentEnvironment();
  }
}
