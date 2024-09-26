import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigAppModule} from "./config/app/config.app.module";
import {UsersModule} from './models/users/users.module';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import typeOrmConfig from "./config/database/mysql/typeorm.config";

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
    imports: [
        ConfigAppModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(typeOrmConfig),
        UsersModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
