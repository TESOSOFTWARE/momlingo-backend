import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: 'root', //process.env.DATABASE_USERNAME => undefined @.@???,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: ['src/models/!**!/entities/!*.entity{.ts,.js}'],
  migrations: ['src/config/database/migrations/!*.ts'],
  migrationsRun: false,
  logging: true,
};

export default typeOrmConfig;
