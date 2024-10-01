import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new JwtGuard(app.get(Reflector)));
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
