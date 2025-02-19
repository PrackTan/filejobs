// Import necessary decorators and modules from @nestjs/common
import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
// Import FileInterceptor and FilesInterceptor from @nestjs/platform-express to handle file uploads
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// Import CloudinaryService to handle business logic related to Cloudinary
import { CloudinaryService } from './cloudinary.service';

// Mark this class as a controller with the base route 'upload'
@Controller('upload')
export class CloudinaryController {
  // Initialize the controller with the CloudinaryService
  constructor(private readonly cloudinaryService: CloudinaryService) { }

  // Define a POST endpoint 'multiple' to handle multiple file uploads
  @Post('multiple')
  // Use FilesInterceptor to allow uploading up to 5 files
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadMultipleFiles(
    // Decorator to extract uploaded files from the request
    @UploadedFiles() files: Express.Multer.File[],
    // Decorator to extract the 'type' field from the request body
    @Body('type') type: string
  ) {
    // Check if files are present; throw an error if no files are uploaded
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    // Determine the resource type based on the 'type' field; default to 'image' if not 'pdf'
    const resourceType = type === 'pdf' ? 'raw' : 'image';
    // Determine the folder name based on the 'type' field; default to 'images' if not 'pdf'
    const folder = type === 'pdf' ? 'pdfs' : 'images';

    // Call the CloudinaryService to upload files and get their URLs
    const fileUrls = await this.cloudinaryService.uploadFiles(files, folder, resourceType);
    // Return the URLs of the uploaded files
    return { urls: fileUrls };
  }
}
