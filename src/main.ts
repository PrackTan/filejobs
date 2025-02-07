// Import các module cần thiết từ @nestjs/core và @nestjs/common
import { NestFactory, Reflector } from '@nestjs/core'; // Import NestFactory và Reflector từ @nestjs/core
import { AppModule } from './app.module'; // Import AppModule từ file app.module
import { ValidationPipe } from '@nestjs/common'; // Import ValidationPipe từ @nestjs/common
import { JwtAuthGuard } from './auth/jwt-auth.guard'; // Import JwtAuthGuard từ file jwt-auth.guard

// Định nghĩa hàm bất đồng bộ bootstrap để khởi động ứng dụng
async function bootstrap() {
  // Tạo một ứng dụng NestJS từ AppModule
  const app = await NestFactory.create(AppModule);
  
  // Sử dụng ValidationPipe để kiểm tra và xác thực dữ liệu đầu vào
  app.useGlobalPipes(new ValidationPipe());
  
  // Lấy Reflector từ ứng dụng
  const reflector = app.get(Reflector);
  
  // Sử dụng JwtAuthGuard để bảo vệ các route bằng JWT
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  
  // Kích hoạt CORS với các cấu hình cụ thể
  app.enableCors({
    origin: 'http://localhost:3000', // Chỉ định nguồn gốc được phép
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Chỉ định các phương thức HTTP được phép
    credentials: true, // Cho phép gửi thông tin xác thực
    allowedHeaders: ['Content-Type', 'Authorization'], // Chỉ định các header được phép
    preflightContinue: false, // Không tiếp tục xử lý preflight request
  });
  
  // Lắng nghe kết nối trên cổng được chỉ định trong biến môi trường hoặc cổng 8080
  await app.listen(process.env.PORT ?? 8080); // Lắng nghe kết nối trên cổng được chỉ định trong biến môi trường hoặc cổng 8080
}

// Gọi hàm bootstrap để khởi động ứng dụng
bootstrap(); // Gọi hàm bootstrap để khởi động ứng dụng
