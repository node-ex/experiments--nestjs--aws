import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  await ConfigModule.envVariablesLoaded;
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

void bootstrap();
