import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './uploads.entity';
import { UploadProvider } from './providers/upload.provider';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadProvider],
  imports: [TypeOrmModule.forFeature([Upload])]
})
export class UploadsModule {}
