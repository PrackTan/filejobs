import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'; // Import các decorator và module cần thiết từ @nestjs/common
import { AppService } from './app.service'; // Import dịch vụ ứng dụng
import { ConfigService } from '@nestjs/config'; // Import dịch vụ cấu hình
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard từ @nestjs/passport
import { LocalAuthGuard } from './auth/local-auth.guard'; // Import LocalAuthGuard để bảo vệ route đăng nhập
import { AuthService } from './auth/auth.service'; // Import dịch vụ xác thực
import { JwtAuthGuard } from './auth/jwt-auth.guard'; // Import JwtAuthGuard để bảo vệ route yêu cầu xác thực JWT
import { Public } from './decorator/customizeDecoratior';

@Controller() // Đánh dấu lớp này là một controller
export class AppController {
  constructor(
    private readonly appService: AppService, // Dịch vụ ứng dụng
    private conficeService: ConfigService, // Dịch vụ cấu hình
    private authService: AuthService // Dịch vụ xác thực
  ) {}

}
