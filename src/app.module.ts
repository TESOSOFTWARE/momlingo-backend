import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigAppModule} from "./config/app/config.app.module";
import {ConfigAppMySQLModule} from "./config/database/mysql/config.db.mysql.mudule";

@Module({
  imports: [ConfigAppModule, ConfigAppMySQLModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
