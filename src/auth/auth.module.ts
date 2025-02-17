import { Module } from '@nestjs/common'; // Import Module từ thư viện @nestjs/common
import { AuthService } from './auth.service'; // Import AuthService từ file auth.service
import { UserModule } from 'src/user/user.module'; // Import UserModule từ file user.module
import { PassportModule } from '@nestjs/passport'; // Import PassportModule từ thư viện @nestjs/passport
import { LocalStrategy } from './passport/local.strategy'; // Import LocalStrategy từ file local.strategy
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule từ thư viện @nestjs/jwt
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule và ConfigService từ thư viện @nestjs/config
import { JwtStrategy } from './passport/jwt.strategy'; // Import JwtStrategy từ file jwt.strategy
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule, // Đăng ký UserModule để sử dụng các chức năng liên quan đến người dùng
    PassportModule, // Đăng ký PassportModule để hỗ trợ xác thực
    JwtModule.registerAsync({
      imports: [ConfigModule], // Đăng ký ConfigModule để sử dụng các biến cấu hình

      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), // Lấy giá trị bí mật JWT_SECRET từ ConfigService
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') } // Thiết lập thời gian hết hạn của token là 1 giờ
      }),
      inject: [ConfigService] // Inject ConfigService để có thể sử dụng trong useFactory
    })
  ],
  controllers: [AuthController], // Đăng ký AuthController để xử lý các yêu cầu HTTP liên quan đến xác thực
  providers: [AuthService, LocalStrategy, JwtStrategy], // Đăng ký các provider: AuthService, LocalStrategy và JwtStrategy
  exports: [AuthService] // Export AuthService để có thể sử dụng ở các module khác
})
export class AuthModule { } // Định nghĩa AuthModule là một module của ứng dụng
