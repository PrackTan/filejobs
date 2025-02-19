// Import cloudinary library và đặt tên alias là cloudinary
import { v2 as cloudinary } from 'cloudinary';
// Import ConfigService từ @nestjs/config để sử dụng trong provider
import { ConfigService } from '@nestjs/config';

// Định nghĩa một provider cho Cloudinary
export const CloudinaryProvider = {
    // Đặt tên provider là 'Cloudinary'
    provide: 'Cloudinary',
    // Sử dụng useFactory để tạo ra một instance của cloudinary với cấu hình từ ConfigService
    useFactory: (configService: ConfigService) => {
        // Trả về cấu hình của cloudinary với các thông tin từ ConfigService
        return cloudinary.config({
            // Lấy cloud_name từ biến môi trường CLOUDINARY_CLOUD_NAME
            cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            // Lấy api_key từ biến môi trường CLOUDINARY_API_KEY
            api_key: configService.get<string>('CLOUDINARY_API_KEY'),
            // Lấy api_secret từ biến môi trường CLOUDINARY_API_SECRET
            api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    },
    // Inject ConfigService vào provider
    inject: [ConfigService],
};
