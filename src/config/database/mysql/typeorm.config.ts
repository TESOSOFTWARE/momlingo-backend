import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: ['src/models/**/entities/*.entity.ts'],
  migrations: ['src/config/database/migrations/!*.ts'],
  migrationsRun: false,
  logging: true,
  extra: {
    charset: 'utf8mb4', // utf8_unicode_ci
  },
};

export default typeOrmConfig;
