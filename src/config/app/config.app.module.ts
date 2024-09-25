import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import * as path from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                process.env.NODE_ENV === 'prod'
                    ? path.resolve(__dirname, '..', '.env.prod')
                    : process.env.NODE_ENV === 'stg'
                        ? path.resolve(__dirname, '..', '.env.stg')
                        : path.resolve(__dirname, '..', '.env.dev'),
            ],
        }),
    ],
})
export class ConfigAppModule {}
