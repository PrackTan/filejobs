import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common"; // Import các decorator và module cần thiết từ @nestjs/common
import { Public } from "src/decorator/customizeDecoratior"; // Import decorator Public từ customizeDecoratior
import { LocalAuthGuard } from "./local-auth.guard"; // Import LocalAuthGuard để bảo vệ route đăng nhập
import { AuthService } from "./auth.service"; // Import dịch vụ xác thực
import { RegisterUserDto } from "src/user/dto/create-user.dto";

@Controller('auth') // Đánh dấu lớp này là một controller với route gốc là 'auth'
export class AuthController {
  constructor(
    private authService: AuthService // Tiêm dịch vụ xác thực vào controller
  ) { }
  @Public() // Đánh dấu route này là public, không cần xác thực
  @UseGuards(LocalAuthGuard) // Sử dụng LocalAuthGuard để bảo vệ route, chỉ cho phép truy cập nếu xác thực thành công
  @Post('/login') // Định nghĩa route POST /login
  handleLogin(@Request() req) { // Xử lý yêu cầu đăng nhập
    // console.log(req.user); // In thông tin người dùng ra console
    return this.authService.login(req.user); // Trả về token đăng nhập sau khi xác thực thành công
  }
  @Public()
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
  // @UseGuards(JwtAuthGuard) // Sử dụng JwtAuthGuard để bảo vệ route, chỉ cho phép truy cập nếu có JWT hợp lệ
  @Get('/profile') // Định nghĩa route GET /profile
  getHello(@Request() req): string { // Xử lý yêu cầu lấy thông tin người dùng
    return req.user; // Trả về thông tin người dùng từ request
  }
}
