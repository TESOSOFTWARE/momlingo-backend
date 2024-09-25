import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                // Tải tệp .env dựa trên NODE_ENV
                process.env.NODE_ENV === 'production'
                    ? path.resolve(__dirname, '..', '.env.prod')
                    : process.env.NODE_ENV === 'staging'
                        ? path.resolve(__dirname, '..', '.env.stg')
                        : path.resolve(__dirname, '..', '.env.dev'),
            ],
        }),
        // Các module khác
    ],
})
export class AppConfigModule {}
