// Import Injectable từ @nestjs/common để đánh dấu AuthService là một service có thể được tiêm vào các component khác
import { Injectable } from '@nestjs/common';
// Import ResponseDto từ đường dẫn 'src/user/dto/reponse' để sử dụng cho việc trả về dữ liệu phản hồi
import { ResponseDto } from 'src/user/dto/reponse';
// Import UserService từ đường dẫn 'src/user/user.service' để sử dụng các phương thức liên quan đến người dùng
import { UserService } from 'src/user/user.service';
// Import JwtService từ @nestjs/jwt để tạo và xác thực token JWT
import { JwtService } from '@nestjs/jwt';
// Import IUser từ đường dẫn 'src/user/users.interface' để sử dụng interface người dùng
import { IUser } from 'src/user/users.interface';
// Sử dụng decorator @Injectable để đánh dấu AuthService là một service có thể được tiêm vào
@Injectable()

// Định nghĩa class AuthService
export class AuthService {
    // Khai báo constructor với hai dependency là userService và jwtService
    constructor(
        private userService: UserService, // Tiêm UserService để sử dụng các phương thức liên quan đến người dùng
        private jwtService: JwtService // Tiêm JwtService để sử dụng các phương thức liên quan đến JWT
    ){}

    // Định nghĩa hàm validateUser để xác thực người dùng
    async validateUser(username: string, pass: string): Promise<any> {
        // Tìm người dùng theo email thông qua userService
        const user = await this.userService.findOneByEmail(username);
        if(user){
            // Kiểm tra mật khẩu có hợp lệ không thông qua userService
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
          const { password, ...result } = user; // Loại bỏ mật khẩu khỏi đối tượng user trước khi trả về
          return result; // Trả về thông tin người dùng
        }
        // Trả về null nếu không hợp lệ
        return null;
    }

    // Định nghĩa hàm login để đăng nhập và tạo token
    async login(user: IUser) {
        if(user){
            const {_id, email, role, name} = user; // Lấy thông tin cần thiết từ đối tượng user
            // Tạo payload chứa thông tin người dùng để tạo token
        const payload = { 
            sub:"token login", // Đặt subject cho token
            iss:"from sever", // Đặt issuer cho token
            email, // Thêm email vào payload
            _id, // Thêm _id vào payload
            role, // Thêm role vào payload
            name // Thêm name vào payload
        };
        // Trả về token truy cập và thông tin người dùng
        return {
            access_token: this.jwtService.sign(payload), // Tạo token từ payload
            _id, // Trả về _id của người dùng
            email, // Trả về email của người dùng
            name // Trả về name của người dùng
            }
        } else {
            return new ResponseDto(400, 'user does not already exists', null);
        }

    }
}
