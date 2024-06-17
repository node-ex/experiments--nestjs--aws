import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloWorldModule } from '@/hello-world/hello-world.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    HelloWorldModule,
    S3Module,
  ],
})
export class AppModule {}
