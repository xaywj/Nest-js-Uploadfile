import {
  Controller,
  Get,
  Post, 
  UseInterceptors,
  UploadedFile, 
} from '@nestjs/common';
import { UploadService } from './upload.service'; 
import { FileInterceptor } from '@nestjs/platform-express'; 
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return await this.uploadService.uploadFile(file);
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }
}
