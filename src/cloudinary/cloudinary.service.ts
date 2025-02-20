// Import Injectable và Inject từ @nestjs/common để sử dụng dependency injection trong service.
import { Injectable, Inject } from '@nestjs/common';
// Import cloudinary v2 và UploadApiResponse từ gói cloudinary để xử lý việc tải lên file.
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
// Import Express để sử dụng các kiểu dữ liệu của nó, đặc biệt là để xử lý việc tải lên file với Multer.
import { Express } from 'express';

// Sử dụng decorator Injectable để đánh dấu class này là một provider có thể được tiêm vào các class khác.
@Injectable()
export class CloudinaryService {
  // Constructor để tiêm dependency Cloudinary vào service.
  constructor(@Inject('Cloudinary') private cloudinary) { }

  // Phương thức bất đồng bộ để tải lên nhiều file lên Cloudinary.
  // async uploadFiles(
  //   files: Express.Multer.File[], // Mảng các file cần tải lên, sử dụng kiểu file của Multer.
  // ): Promise<{ url: string; type: string }[]> { // Trả về một promise giải quyết thành mảng các đối tượng chứa URL và loại của từng file đã tải lên.
  //   // Duyệt qua từng file để tạo mảng các promise cho việc tải lên.
  //   const uploadPromises = files.map((file) => {
  //     // Trả về một promise mới cho mỗi lần tải lên file.
  //     return new Promise<{ url: string; type: string }>((resolve, reject) => {
  //       // Xác định loại file dựa trên phần mở rộng của nó.
  //       const extension = file.mimetype.split('/')[1];
  //       let resourceType: 'image' | 'video' | 'raw' = 'image'; // Loại tài nguyên mặc định là 'image'.

  //       // Kiểm tra nếu phần mở rộng file khớp với các loại hình ảnh thông thường.
  //       if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension)) {
  //         resourceType = 'image';
  //       }
  //       // Kiểm tra nếu phần mở rộng file khớp với các loại video thông thường.
  //       else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) {
  //         resourceType = 'video';
  //       }
  //       // Kiểm tra nếu phần mở rộng file khớp với các loại tài liệu hoặc lưu trữ thông thường.
  //       else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip'].includes(extension)) {
  //         resourceType = 'raw';
  //       }

  //       // Sử dụng phương thức upload_stream của Cloudinary để tải lên file.
  //       cloudinary.uploader.upload_stream(
  //         { resource_type: resourceType }, // Chỉ định loại tài nguyên và thư mục cho việc tải lên.
  //         (error, result: UploadApiResponse) => { // Hàm callback để xử lý kết quả tải lên.
  //           if (error) return reject(error); // Từ chối promise nếu có lỗi.
  //           resolve({ url: result.secure_url, type: resourceType }); // Giải quyết promise với URL và loại của file.
  //         }
  //       ).end(file.buffer); // Kết thúc stream bằng cách truyền buffer của file.
  //     });
  //   });

  //   // Trả về một promise giải quyết khi tất cả các promise tải lên file được giải quyết.
  //   return Promise.all(uploadPromises);
  // }

  /**
   * Upload nhiều file lên Cloudinary
   * @param files Danh sách file cần upload
   * @param folder Thư mục lưu trữ trên Cloudinary
   * @returns Danh sách URL và loại file đã upload
   */
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string
  ): Promise<{ url: string; type: string; public_id: string }[]> {
    // Duyệt qua từng file và tạo Promise để upload lên Cloudinary
    const uploadPromises = files.map((file) => {
      return new Promise<{ url: string; type: string; public_id: string }>((resolve, reject) => {
        // Xác định loại file dựa trên phần mở rộng
        const extension = file.mimetype.split('/')[1];
        let resourceType: 'image' | 'video' | 'raw' = 'image'; // Mặc định là ảnh

        if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension)) {
          resourceType = 'image';
        } else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) {
          resourceType = 'video';
        } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip'].includes(extension)) {
          resourceType = 'raw';
        }

        // Upload file lên Cloudinary
        cloudinary.uploader.upload_stream(
          { resource_type: resourceType, folder: folder }, // Chỉ định loại file & thư mục
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) return reject(error);
            resolve({ url: result.secure_url, type: resourceType, public_id: result.public_id }); // Lưu cả `public_id`
          }
        ).end(file.buffer);
      });
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Xóa file trên Cloudinary theo `public_id`
   * @param publicId ID file trên Cloudinary
   * @returns Trạng thái xóa file
   */
  async deleteFile(publicId: string): Promise<{ deleted: boolean; message: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject({ deleted: false, message: 'Lỗi khi xóa file' });
        resolve({ deleted: true, message: 'File đã được xóa thành công' });
      });
    });
  }
}
