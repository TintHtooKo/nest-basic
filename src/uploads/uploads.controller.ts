import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type-enum';
import { UploadsService } from './providers/uploads.service';

@Auth(AuthType.Bearer)
@Controller('uploads')
export class UploadsController {
    constructor(
        private readonly uploadService:UploadsService
    ){}
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.uploadFile(file)
    }
}
