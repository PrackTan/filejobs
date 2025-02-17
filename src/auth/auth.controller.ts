import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from "@nestjs/common"; // Import các decorator và module cần thiết từ @nestjs/common
import { Public, ResponseMessage, User } from "src/decorator/customizeDecoratior"; // Import decorator Public từ customizeDecoratior
import { LocalAuthGuard } from "./local-auth.guard"; // Import LocalAuthGuard để bảo vệ route đăng nhập
import { AuthService } from "./auth.service"; // Import dịch vụ xác thực
import { RegisterUserDto } from "src/user/dto/create-user.dto";

@Controller('auth') // Đánh dấu lớp này là một controller với route gốc là 'auth'
export class AuthController {
  constructor(
    private authService: AuthService // Tiêm dịch vụ xác thực vào controller
  ) { }
  @ResponseMessage('Login success')
  @Public() // Đánh dấu route này là public, không cần xác thực
  @UseGuards(LocalAuthGuard) // Sử dụng LocalAuthGuard để bảo vệ route, chỉ cho phép truy cập nếu xác thực thành công
  @Post('/login') // Định nghĩa route POST /login
  handleLogin(@Req() req, @Res({ passthrough: true }) res: Response) { // Xử lý yêu cầu đăng nhập
    // console.log(req.user); // In thông tin người dùng ra console
    return this.authService.login(req.user, res); // Trả về token đăng nhập sau khi xác thực thành công
  }
  @Public()
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
  @ResponseMessage('Get profile success')
  // @UseGuards(JwtAuthGuard) // Sử dụng JwtAuthGuard để bảo vệ route, chỉ cho phép truy cập nếu có JWT hợp lệ
  @Get('/profile') // Định nghĩa route GET /profile
  getProfile(@Request() req): string { // Xử lý yêu cầu lấy thông tin người dùng
    return req.user; // Trả về thông tin người dùng từ request
  }
  @Public()
  @ResponseMessage('Get token success')
  @Get('/refresh') // Định nghĩa route GET /refreshtoken
  getRefreshToken(@Request() req, @Res({ passthrough: true }) res: Response) { // Xử lý yêu cầu lấy token làm mới
    const refreshToken = req.cookies['refresh_token'];
    return this.authService.getNewToken(refreshToken, res); // Trả về token làm mới sau khi xử lý
  }
  @Public()
  @ResponseMessage('Logout success')
  @Get('/logout') // Định nghĩa route GET /logout
  logout(@Res({ passthrough: true }) res: Response, @User() user: any) { // Xử lý yêu cầu đăng xuất
    const logout = this.authService.logout(res, user);
    return { logout }; // Trả về thông báo đăng xuất thành công
  }
}
