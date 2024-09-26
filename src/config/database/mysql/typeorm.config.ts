import {User} from "../../../models/users/entities/user.entity";
import {TypeOrmModuleOptions} from "@nestjs/typeorm";

// Note: process.env not working with username, password here.
// You must manually configure each .env
const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    // username: process.env.DATABASE_USERNAME,
    // password: process.env.DATABASE_PASSWORD,
    // database: process.env.DATABASE_NAME,
    username: 'root',
    password: '12345678',
    database: 'momlingo_db_dev',
    synchronize: false,
    entities: [User],
    migrations: ['src/config/database/migrations/!*.entity{.ts,.js}'],
    migrationsRun: false,
    logging: true,
};

export default typeOrmConfig;
