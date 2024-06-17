import { S3Service } from '@/s3/s3.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('upload-folder')
  async uploadFolder(): Promise<void> {
    await this.s3Service.uploadFolder('public');
  }
}
