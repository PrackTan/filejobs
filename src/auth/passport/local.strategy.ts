import { Strategy } from 'passport-local'; // Import Strategy từ thư viện passport-local
import { PassportStrategy } from '@nestjs/passport'; // Import PassportStrategy từ thư viện @nestjs/passport
import { Injectable, UnauthorizedException } from '@nestjs/common'; // Import Injectable và UnauthorizedException từ thư viện @nestjs/common
import { AuthService } from '../auth.service'; // Import AuthService từ file auth.service

@Injectable() // Đánh dấu lớp LocalStrategy là một service có thể được inject vào các nơi khác
export class LocalStrategy extends PassportStrategy(Strategy) { // Định nghĩa lớp LocalStrategy kế thừa từ PassportStrategy với chiến lược Strategy
  constructor(private authService: AuthService) { // Inject AuthService để sử dụng trong constructor
    super(); // Gọi constructor của lớp cha PassportStrategy
  }

  async validate(username: string, password: string): Promise<any> { // Hàm validate để xác thực username và password
    const user = await this.authService.validateUser(username, password); // Gọi hàm validateUser của AuthService để xác thực người dùng
    if (!user) { // Nếu không tìm thấy người dùng
      throw new UnauthorizedException("username or password not correct"); // Ném ra ngoại lệ UnauthorizedException
    }
    return user; // Trả về thông tin người dùng nếu xác thực thành công
  }
}
