import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('Cloudinary') private cloudinary) { }

  async uploadFiles(files: Express.Multer.File[], folder: string, resourceType: string): Promise<string[]> {
    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: resourceType as "image" | "video" | "raw" | "auto", folder: folder },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url); // Trả về URL của file đã upload
          }
        ).end(file.buffer);
      });
    });

    return Promise.all(uploadPromises);
  }
}
