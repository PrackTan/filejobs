// Import Module decorator từ @nestjs/common để đánh dấu class này là một module
import { Module } from '@nestjs/common';
// Import CloudinaryService từ file cloudinary.service để sử dụng trong module này
import { ConfigModule } from '@nestjs/config';
// Import CloudinaryProvider từ file cloudinary.provider để sử dụng trong module này
import { CloudinaryProvider } from './cloudinary.provider';

// Sử dụng decorator Module để định nghĩa các thành phần của module này
@Module({
  // Định nghĩa các module khác cần import vào module này
  imports: [ConfigModule],
  // Định nghĩa các provider (service) sẽ được sử dụng trong module này
  providers: [CloudinaryProvider],
  // Định nghĩa các provider (service) sẽ được export ra ngoài để các module khác có thể sử dụng
  exports: [CloudinaryProvider],
})
// Định nghĩa class CloudinaryModule là một module của NestJS
export class CloudinaryModule { }
