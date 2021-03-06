import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  const config = app.get(ConfigService);
  const PORT = config.get('app.PORT');
  await app.listen(PORT);
}
bootstrap();
