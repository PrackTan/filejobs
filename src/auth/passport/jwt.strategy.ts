import { ExtractJwt, Strategy } from 'passport-jwt'; // Import ExtractJwt và Strategy từ thư viện passport-jwt
import { PassportStrategy } from '@nestjs/passport'; // Import PassportStrategy từ thư viện @nestjs/passport
import { Injectable } from '@nestjs/common'; // Import Injectable từ thư viện @nestjs/common
import { ConfigService } from '@nestjs/config'; // Import ConfigService từ thư viện @nestjs/config
import { IUser } from 'src/user/users.interface';

@Injectable() // Đánh dấu lớp JwtStrategy là một service có thể được inject vào các nơi khác
export class JwtStrategy extends PassportStrategy(Strategy) { // Định nghĩa lớp JwtStrategy kế thừa từ PassportStrategy với chiến lược Strategy
  constructor(
    private configService: ConfigService // Inject ConfigService để sử dụng trong constructor
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Cấu hình để lấy JWT từ header Authorization dưới dạng Bearer token
      ignoreExpiration: false, // Không bỏ qua thời gian hết hạn của JWT, tức là JWT hết hạn sẽ không hợp lệ
      secretOrKey: configService.get('JWT_SECRET'), // Lấy secret key từ ConfigService để xác thực JWT
    });
  }

  async validate(payload: IUser) { // Hàm validate để xác thực payload của JWT
    const {_id, email, role, name} = payload;
    return {_id, email, role, name}; // Trả về một đối tượng chứa userId và username từ payload
  }
}
