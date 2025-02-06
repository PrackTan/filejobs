import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'; // Import các thành phần cần thiết từ @nestjs/common
import { Reflector } from '@nestjs/core'; // Import Reflector từ @nestjs/core
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard từ @nestjs/passport
import { IS_PUBLIC_KEY } from 'src/decorator/customizeDecoratior'; // Import hằng số IS_PUBLIC_KEY từ customizeDecoratior

@Injectable() // Đánh dấu lớp JwtAuthGuard là một service có thể được inject vào các nơi khác
export class JwtAuthGuard extends AuthGuard('jwt') { // Định nghĩa lớp JwtAuthGuard kế thừa từ AuthGuard với chiến lược 'jwt'
    constructor(private reflector: Reflector) { // Khởi tạo lớp với một Reflector để truy xuất metadata
        super(); // Gọi constructor của lớp cha
    }
    canActivate(context: ExecutionContext) { // Phương thức canActivate để kiểm tra xem yêu cầu có được phép hay không
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [ // Lấy giá trị metadata isPublic từ handler và class
            context.getHandler(), // Lấy handler hiện tại
            context.getClass(), // Lấy class hiện tại
        ]);
        if (isPublic) { // Nếu route là public
            return true; // Cho phép truy cập
        }
        return super.canActivate(context); // Ngược lại, gọi phương thức canActivate của lớp cha để xác thực
    }

    handleRequest(err, user, info) { // Phương thức handleRequest để xử lý kết quả xác thực
        if(err || !user){ // Nếu có lỗi hoặc không có người dùng
            throw err || new UnauthorizedException("lỗi token"); // Ném ra lỗi hoặc UnauthorizedException
        }
        return user; // Trả về người dùng nếu xác thực thành công
    }
    
} // Kết thúc định nghĩa lớp JwtAuthGuard
