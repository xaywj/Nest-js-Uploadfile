import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { File } from './entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, File])],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [TypeOrmModule],
})
export class UploadModule {}
