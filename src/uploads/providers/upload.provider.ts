import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';

@Injectable()
export class UploadProvider {
    constructor(
        private readonly configService:ConfigService
    ){}

    async uploadFile(file: Express.Multer.File) {
        const s3Client = new S3Client({
            region: this.configService.get("appConfig.awsRegion"),
            credentials:{
                accessKeyId: this.configService.get("appConfig.awsS3AccessKey")!,
                secretAccessKey: this.configService.get("appConfig.awsS3SecretKey")!
            }
        })

        const fileName = this.generateFileName(file)

        try {
            const command = new PutObjectCommand({
                Bucket: this.configService.get("appConfig.awsBucketName"),
                Body: file.buffer,
                Key: fileName,
                ContentType: file.mimetype
            })
            await s3Client.send(command)
            return fileName
        } catch (error) {
            throw new RequestTimeoutException(error)
        }
    }

    private generateFileName(file: Express.Multer.File) {
        let name = file.originalname.split('.')[0];
        name = name.replace(/\s/g, '').trim();

        let extension = path.extname(file.originalname);
        let timeStamp = new Date().getTime().toString().trim();

        return `${name}-${timeStamp}${extension}`
    }
}
