import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigAppModule} from "./config/app/config.app.module";
import {ConfigAppMySQLModule} from "./config/database/mysql/config.db.mysql.mudule";
import {UsersModule} from './models/users/users.module';
import {UsersService} from './models/users/users.service';
import {UsersController} from './models/users/users.controller';

@Module({
    imports: [ConfigAppModule, ConfigAppMySQLModule, UsersModule],
    controllers: [AppController, UsersController],
    providers: [AppService, UsersService],
})
export class AppModule {
}
