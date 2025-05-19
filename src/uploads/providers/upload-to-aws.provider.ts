import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
@Injectable()
export class UploadToAwsProvider {
  constructor(private readonly configService: ConfigService) {}
  public async fileUpload(file: Express.Multer.File) {
    const client = new S3Client({
      region: 'default',
      endpoint: `https://${this.configService.get('appConfig.awsAddress')}`,
      credentials: {
        accessKeyId: this.configService.get('appConfig.awsAccessKey') as string,
        secretAccessKey: this.configService.get(
          'appConfig.awsSecretKey',
        ) as string,
      },
    });
    const name = this.generateFileName(file);
    const params = {
      Bucket: this.configService.get('appConfig.awsBucketName') as string,
      Body: file.buffer,
      Key: name,
      ContentType: file.mimetype,
    };

    try {
      const uploadResult = await client.send(new PutObjectCommand(params));
      console.log('uploadResult', uploadResult);

      return name;
    } catch (error) {
      console.log('❌❌❌❌', error);

      throw new RequestTimeoutException(error);
    }
  }

  private generateFileName(file: Express.Multer.File) {
    const name = file.originalname.split('.')[0];
    name.replace(/\s/g, '').trim();

    const extension = path.extname(file.originalname);

    const timestamp = new Date().getTime().toString().trim();
    return `${name}-${timestamp}-${uuid()}${extension}`;
  }
}
