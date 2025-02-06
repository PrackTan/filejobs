import { Module } from '@nestjs/common'; // Import Module từ thư viện @nestjs/common
import { AppController } from './app.controller'; // Import AppController từ file app.controller
import { AppService } from './app.service'; // Import AppService từ file app.service
import { UserModule } from './user/user.module'; // Import UserModule từ file user.module
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule và ConfigService từ thư viện @nestjs/config
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule từ thư viện @nestjs/mongoose
import { AuthModule } from './auth/auth.module'; // Import AuthModule từ file auth.module
import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD từ thư viện @nestjs/core
import { JwtAuthGuard } from './auth/jwt-auth.guard'; // Import JwtAuthGuard từ file jwt-auth.guard

@Module({
  imports: [
    UserModule, // Đăng ký UserModule để sử dụng trong AppModule
    ConfigModule.forRoot({ isGlobal: true }), // Đăng ký ConfigModule và cấu hình nó là global để có thể sử dụng ở mọi nơi
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Đăng ký ConfigModule để sử dụng trong MongooseModule
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // Lấy URI của MongoDB từ ConfigService
      }),
      inject: [ConfigService], // Tiêm ConfigService vào useFactory để sử dụng
    }),
    AuthModule, // Đăng ký AuthModule để sử dụng trong AppModule
  ],
  controllers: [AppController], // Đăng ký AppController để xử lý các yêu cầu HTTP
  providers: [
    AppService, // Đăng ký AppService để cung cấp các dịch vụ cho AppModule
    {
      provide: APP_GUARD, // Cung cấp APP_GUARD để bảo vệ các route
      useClass: JwtAuthGuard, // Sử dụng JwtAuthGuard để bảo vệ các route
    },
  ], // Đăng ký các provider cho AppModule
})
export class AppModule {} // Định nghĩa AppModule là module chính của ứng dụng
