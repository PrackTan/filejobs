// Import các module cần thiết từ @nestjs/core và @nestjs/common
import { NestFactory, Reflector } from '@nestjs/core'; // Import NestFactory để tạo ứng dụng NestJS và Reflector để truy xuất metadata
import { AppModule } from './app.module'; // Import AppModule, module gốc của ứng dụng
import { ValidationPipe, VersioningType } from '@nestjs/common'; // Import ValidationPipe để xác thực dữ liệu và VersioningType để quản lý phiên bản API
import { JwtAuthGuard } from './auth/jwt-auth.guard'; // Import JwtAuthGuard để bảo vệ các route bằng JWT
import { TransformInterceptor } from './interceptor/transform.interceptor'; // Import TransformInterceptor để can thiệp vào quá trình xử lý response
import * as cookieParser from 'cookie-parser'; // Import cookieParser để phân tích cookie từ request
// Định nghĩa hàm bất đồng bộ bootstrap để khởi động ứng dụng
async function bootstrap() {
  // Tạo một ứng dụng NestJS từ AppModule
  const app = await NestFactory.create(AppModule); // Sử dụng NestFactory để tạo một instance của ứng dụng từ AppModule

  // Sử dụng ValidationPipe để kiểm tra và xác thực dữ liệu đầu vào
  app.useGlobalPipes(new ValidationPipe()); // Đăng ký ValidationPipe toàn cục để tự động xác thực dữ liệu đầu vào cho tất cả các request

  // Lấy Reflector từ ứng dụng
  const reflector = app.get(Reflector); // Lấy instance của Reflector từ container của ứng dụng để sử dụng trong các guard và interceptor

  // Sử dụng TransformInterceptor để can thiệp vào quá trình xử lý response
  app.useGlobalInterceptors(new TransformInterceptor(reflector)); // Đăng ký TransformInterceptor toàn cục để xử lý và định dạng lại response

  // Sử dụng JwtAuthGuard để bảo vệ các route bằng JWT
  app.useGlobalGuards(new JwtAuthGuard(reflector)); // Đăng ký JwtAuthGuard toàn cục để bảo vệ các route bằng cách xác thực JWT

  // cookie
  app.use(cookieParser());

  // Kích hoạt CORS với các cấu hình cụ thể
  app.enableCors({
    origin: process.env.ORIGIN, // Chỉ định nguồn gốc được phép truy cập, ở đây là localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Chỉ định các phương thức HTTP được phép
    credentials: true, // Cho phép gửi thông tin xác thực như cookies trong các request
    allowedHeaders: ['Content-Type', 'Authorization'], // Chỉ định các header được phép trong request
    preflightContinue: false, // Không tiếp tục xử lý preflight request
  });

  // Cấu hình phiên bản API
  app.setGlobalPrefix('api'); // Đặt tiền tố cho tất cả các route là 'api/v'
  app.enableVersioning({
    type: VersioningType.URI, // Sử dụng URI để quản lý phiên bản API
    defaultVersion: ['1', '2'] // Đặt các phiên bản mặc định là 1 và 2
  });

  // Lắng nghe kết nối trên cổng được chỉ định trong biến môi trường hoặc cổng 8080
  await app.listen(process.env.PORT ?? 8080); // Khởi động ứng dụng và lắng nghe kết nối trên cổng được chỉ định trong biến môi trường hoặc cổng 8080
}

// Gọi hàm bootstrap để khởi động ứng dụng
bootstrap(); // Thực thi hàm bootstrap để khởi động ứng dụng
