import { DataSource } from 'typeorm';

// Note: process.env not working with username, password here.
// You must manually configure each .env
// Create database first, then change database corresponding env
const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: 'root',
  password: '12345678',
  database: 'momlingo_db_dev',
  synchronize: false,
  entities: ['src/models/**/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsRun: false,
  logging: true,
  extra: {
    charset: 'utf8mb4', // utf8_unicode_ci
  },
});

export default AppDataSource;
