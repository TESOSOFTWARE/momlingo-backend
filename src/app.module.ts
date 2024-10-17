import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigAppModule } from './config/app/config.app.module';
import { UsersModule } from './models/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import typeOrmConfig from './config/database/mysql/typeorm.config';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { ChildrenModule } from './models/children/children.module';
import { UsersController } from './models/users/users.controller';
import { UsersService } from './models/users/users.service';
dotenv.config();

@Module({
  imports: [
    ConfigAppModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => typeOrmConfig,
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
    UsersModule,
    ChildrenModule,
    AuthModule,
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    AuthService,
    UsersService,
    JwtStrategy,
  ],
})
export class AppModule {}
