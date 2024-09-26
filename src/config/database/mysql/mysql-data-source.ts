import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import {User} from "../../../models/users/entities/user.entity";

config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: false,
    entities: [User],
    synchronize: false,
};