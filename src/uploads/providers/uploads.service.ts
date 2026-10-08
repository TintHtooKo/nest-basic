import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UploadProvider } from './upload.provider';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from '../uploads.entity';
import { Repository } from 'typeorm';
import { UploadFileType } from '../interfaces/upload.interface';

@Injectable()
export class UploadsService {
    constructor(
        private readonly configService:ConfigService,

        private readonly uploadProvider:UploadProvider,

        @InjectRepository(Upload)
        private readonly uploadRepository:Repository<Upload>
    ){}
    async uploadFile(file: Express.Multer.File) {
        if(!['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(file.mimetype)){
            throw new BadRequestException("Invalid file type")
        }

        try {
            const filename = await this.uploadProvider.uploadFile(file)
            const uploadFile:UploadFileType = {
                name:filename,
                path:`https://${this.configService.get("appConfig.awsCloudfrontUrl")}/${filename}`,
                mime:file.mimetype,
                size:file.size,
            }
            const upload = this.uploadRepository.create(uploadFile)
            return await this.uploadRepository.save(upload)
        } catch (error) {
            throw new ConflictException(error)
        }
    }
}
