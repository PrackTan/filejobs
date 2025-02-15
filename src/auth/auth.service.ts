// Import Injectable từ @nestjs/common để đánh dấu AuthService là một service có thể được tiêm vào các component khác
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Import UserService từ đường dẫn 'src/user/user.service' để sử dụng các phương thức liên quan đến người dùng
import { UserService } from 'src/user/user.service';
// Import JwtService từ @nestjs/jwt để tạo và xác thực token JWT
import { JwtService } from '@nestjs/jwt';
// Import IUser từ đường dẫn 'src/user/users.interface' để sử dụng interface người dùng
import { IUser } from 'src/Interface/users.interface';
import { RegisterUserDto } from 'src/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
// Sử dụng decorator @Injectable để đánh dấu AuthService là một service có thể được tiêm vào
@Injectable()

// Định nghĩa class AuthService
export class AuthService {
    // Khai báo constructor với hai dependency là userService và jwtService
    constructor(
        private userService: UserService, // Tiêm UserService để sử dụng các phương thức liên quan đến người dùng
        private jwtService: JwtService, // Tiêm JwtService để sử dụng các phương thức liên quan đến JWT
        private configService: ConfigService // Tiêm ConfigService để sử dụng các phương thức liên quan đến config
    ) { }

    // Định nghĩa hàm validateUser để xác thực người dùng
    async validateUser(username: string, pass: string): Promise<any> {
        // Tìm người dùng theo email thông qua userService
        const user = await this.userService.findOneByEmail(username);
        if (user) {
            // Kiểm tra mật khẩu có hợp lệ không thông qua userService
            const isValid = await this.userService.isValidUserpassword(pass, user.password);
            if (isValid === true) {
                // Trả về đối tượng ResponseDto với mã 200 nếu mật khẩu hợp lệ
                return user;
            }
        } else {
            // Trả về đối tượng ResponseDto với mã 400 nếu người dùng không tồn tại
            throw new HttpException('user does not already exists', HttpStatus.BAD_REQUEST);
        }
        // Kiểm tra lại mật khẩu và trả về thông tin người dùng nếu hợp lệ
        if (user && user?.password === pass) {
            const { password, ...result } = user; // Loại bỏ mật khẩu khỏi đối tượng user trước khi trả về
            return result; // Trả về thông tin người dùng
        }
        // Trả về null nếu không hợp lệ
        return null;
    }
    createRefreshToken(user: IUser) {
        const refreshToken = this.jwtService.sign(user, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN')
        });
        return refreshToken;
    }
    // Định nghĩa hàm login để đăng nhập và tạo token
    async login(user: any, res) {

        if (user) {
            console.log("check user", user);
            const { _id, email, role, name } = user; // Lấy thông tin cần thiết từ đối tượng user
            // Tạo payload chứa thông tin người dùng để tạo token
            // console.log("check user>>>>>>>>>>>>>",user.data);
            const payload = {
                sub: "token login", // Đặt subject cho token
                iss: "from sever", // Đặt issuer cho token
                email, // Thêm email vào payload
                _id, // Thêm _id vào payload
                role, // Thêm role vào payload
                name // Thêm name vào payload
            };
            // Tạo token truy cập và token làm mới
            const refreshToken = this.createRefreshToken(payload);
            // Cập nhật token làm mới cho người dùng
            await this.userService.updateUserToken(refreshToken, _id);
            // set cookie
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true, // chỉ truy cập được từ server
                secure: true, // chỉ truy cập được từ server
                maxAge: 1000 * 60 * 60 * 24 * 30 // 30 ngày
            });
            // Trả về token truy cập và thông tin người dùng
            return {
                access_token: this.jwtService.sign(payload), // Tạo token từ payload
                // refresh_token: refreshToken, // Trả về token làm mới
                user: {
                    _id, // Trả về _id của người dùng
                    email, // Trả về email của người dùng
                    name // Trả về name của người dùng
                }
            }
        } else {
            throw new HttpException('user does not already exists', HttpStatus.BAD_REQUEST);
        }

    }
    async register(registerUserDto: RegisterUserDto) {
        return this.userService.register(registerUserDto);
    }

}
