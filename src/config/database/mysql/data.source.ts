import {DataSource} from 'typeorm';

// Note: process.env not working with username, password here.
// You must manually configure each .env
const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: 'root',
    password: '12345678',
    database: 'momlingo_db_dev',
    synchronize: false,
    entities: ['src/models/**/entities/*.entity{.ts,.js}'],
    migrations: ['src/config/database/migrations/*.ts'],
    migrationsRun: false,
    logging: true,
});

export default AppDataSource;
