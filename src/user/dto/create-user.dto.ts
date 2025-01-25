import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

// CreateUserDto class is used to define the structure and validation rules for creating a new user.
export class CreateUserDto {
    // The email field must be a valid email address.
    @IsEmail(
        {},{message: 'Email không đúng định dạng'}
    )
    email: string;

    // The password field must not be empty and must have a minimum length of 8 characters.
    @IsNotEmpty({message: 'Mật khẩu không được để trống'})
    @MinLength(8,{message: 'Mật khẩu phải có ít nhất 8 ký tự'})
    password: string;

    // The name field must not be empty.
    @IsNotEmpty({message: 'Tên không được để trống'})
    name: string;

    // The address field is optional.s
    @IsOptional()
    address: string;

    @IsNotEmpty({message: 'Số điện thoại không được để trống'})
    // The phone field is optional.
    @IsOptional()
    phone: string;
}
