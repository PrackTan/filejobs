// Import Module decorator từ @nestjs/common để đánh dấu class này là một module
import { Module, Global } from '@nestjs/common';
// Import CloudinaryService từ file cloudinary.service để sử dụng trong module này
import { ConfigModule } from '@nestjs/config';
// Import CloudinaryProvider từ file cloudinary.provider để sử dụng trong module này
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
// Sử dụng decorator Module để định nghĩa các thành phần của module này
@Global()
@Module({
  // Định nghĩa các module khác cần import vào module này
  imports: [ConfigModule],
  // Định nghĩa các provider (service) sẽ được sử dụng trong module này
  providers: [CloudinaryProvider, CloudinaryService],
  // Định nghĩa các provider (service) sẽ được export ra ngoài để các module khác có thể sử dụng
  exports: [CloudinaryProvider, CloudinaryService],
})
// Định nghĩa class CloudinaryModule là một module của NestJS
export class CloudinaryModule { }
