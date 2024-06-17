// src/s3.service.ts
import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  Permission,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { readdir, readFile, stat } from 'fs/promises';
import { join, relative } from 'path';
import * as mime from 'mime-types';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env['AWS_REGION']!,
      credentials: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID']!,
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']!,
      },
    });
  }

  async uploadFolder(relativePath: string) {
    const bucketName = process.env['AWS_S3_BUCKET']!;
    const absolutePath = join(process.cwd(), relativePath);
    await this.uploadDirectoryRecursive(absolutePath, bucketName, absolutePath);
  }

  private async uploadDirectoryRecursive(
    currentPath: string,
    bucketName: string,
    rootPath: string,
  ) {
    const files = await readdir(currentPath);

    for (const file of files) {
      const filePath = join(currentPath, file);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory()) {
        await this.uploadDirectoryRecursive(filePath, bucketName, rootPath);
      } else if (fileStat.isFile()) {
        const fileContent = await readFile(filePath);
        const relativeFilePath = relative(rootPath, filePath);
        const contentType = mime.lookup(filePath) || 'application/octet-stream';

        const uploadParams = {
          Bucket: bucketName,
          Key: relativeFilePath, // Preserving the relative path in the bucket
          Body: fileContent,
          ContentType: contentType,
          ACL: ObjectCannedACL.public_read,
        };

        try {
          await this.s3Client.send(new PutObjectCommand(uploadParams));
          console.log(
            `Successfully uploaded ${relativeFilePath} to ${bucketName}`,
          );
        } catch (err) {
          console.error(`Error uploading ${relativeFilePath}:`, err);
        }
      }
    }
  }
}
