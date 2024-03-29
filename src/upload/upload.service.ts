import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs-extra'; // Import fs-extra for file system operations
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity'; 
@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  createUploadsFolder(): string {
    const uploadsFolderPath = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadsFolderPath)) {
      fs.mkdirSync(uploadsFolderPath, { recursive: true });
    }
    return uploadsFolderPath;
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ folderName: string; filename: string; filepath: string }> {
    try {
      const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
      const { folderName } = await this.createFolder();
      const newFolderPath = path.join(uploadsDir, folderName);
      const { filename } = await this.generateFileName(file);
      const filePath = path.join(newFolderPath, filename);

      // Use fs-extra to move the uploaded file to the new folder
      await fs.ensureDir(newFolderPath); // Ensure the folder exists
      await fs.move(file.path, filePath); // Move the file to the new location

      // Save folder and file information to database
      const folder = await this.folderRepository.save({
        folder_name: folderName,
      });
      await this.fileRepository.save({
        name: filename,
        file_path: filePath,
        folder,
      });

      return { folderName, filename, filepath: filePath };
    } catch (error) {
      throw new BadRequestException(error.message || 'Internal server error.');
    }
  }

  async generateFileName(
    file: Express.Multer.File,
  ): Promise<{ filename: string }> {
    const originalFilename = file.originalname;
    const fileExtension = originalFilename.split('.').pop(); // Get file extension
    const newFileName = `file_${Date.now()}.${fileExtension}`;
    return { filename: newFileName };
  }

  async createFolder(): Promise<{ folderName: string }> {
    const newFolderName = `folder_${Date.now()}`;
    // Create the new folder
    // Note: You might need to handle errors if the folder already exists
    return { folderName: newFolderName };
  }

  async findAll(): Promise<Folder[]> {
    try {
      const folders = await this.folderRepository.find({ relations: ['files'] });
      return folders;
    } catch (error) {
      throw new BadRequestException(error.message || 'Internal server error.');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
