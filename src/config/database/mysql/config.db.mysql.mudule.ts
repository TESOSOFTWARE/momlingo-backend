import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../../../models/users/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT, 10),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            autoLoadEntities: true,
            entities: [User],
            synchronize: process.env.NODE_ENV !== 'prod',
            migrations: ['src/database/migrations'],

        }),
    ],
})
export class ConfigAppMySQLModule {}
