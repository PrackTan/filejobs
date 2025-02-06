import { Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/user/dto/reponse';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()

export class AuthService {
    constructor(
        private userService: UserService, 
        private jwtService: JwtService
    ){}

    // Hàm validateUser dùng để xác thực người dùng
    async validateUser(username: string, pass: string): Promise<any> {
        // Tìm người dùng theo email
        const user = await this.userService.findOneByEmail(username);
        if(user){
            // Kiểm tra mật khẩu có hợp lệ không
            const isValid = await this.userService.isValidUserpassword(pass, user.password);
            if(isValid === true){
                // Trả về đối tượng ResponseDto với mã 200 nếu mật khẩu hợp lệ
                return new ResponseDto(200, 'Is valid password', user);
            }
        } else {
            // Trả về đối tượng ResponseDto với mã 400 nếu người dùng không tồn tại
            return new ResponseDto(400, 'user does not already exists', null);
        }
        // Kiểm tra lại mật khẩu và trả về thông tin người dùng nếu hợp lệ
        if (user && user.password === pass) {
          const { password, ...result } = user;
          return result;
        }
        // Trả về null nếu không hợp lệ
        return null;
    }

    // Hàm login dùng để đăng nhập và tạo token
    async login(user: any) {
        // Tạo payload chứa thông tin người dùng
        const payload = { username: user.data.email, sub: user.data._id };
        // Trả về token truy cập
        return {
            access_token: this.jwtService.sign(payload)
        }

    }
}
