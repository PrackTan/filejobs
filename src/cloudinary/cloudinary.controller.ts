import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) { }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Cho phép tối đa 10 file
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder: string // Cho phép chọn thư mục
  ) {
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    const fileUrls = await this.cloudinaryService.uploadFiles(files, folder);
    return { uploaded: fileUrls };
  }
}
