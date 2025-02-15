import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, MinLength, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';


class Company {
    @IsNotEmpty({ message: 'ID công ty không được để trống' })
    _id: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({ message: 'Tên công ty không được để trống' })
    name: string;

}

// CreateUserDto class is used to define the structure and validation rules for creating a new user.
export class CreateUserDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;
    // The email field must be a valid email address.
    @IsEmail(
        {}, { message: 'Email không đúng định dạng' }
    )
    email: string;

    // The password field must not be empty and must have a minimum length of 8 characters.
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    password: string;

    @IsNotEmpty({ message: 'Tuổi không được để trống' })
    age: number;
    // The address field is optional.s
    @IsOptional()
    address: string;

    gender: string;

    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    phone: string;

    role: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}
export class RegisterUserDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;
    // The email field must be a valid email address.
    @IsEmail(
        {}, { message: 'Email không đúng định dạng' }
    )
    email: string;

    // The password field must not be empty and must have a minimum length of 8 characters.
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    password: string;

    age: number;
    // The address field is optional.s
    @IsOptional()
    address: string;
    @IsNotEmpty({ message: 'Giới tính không được để trống' })
    gender: string;

    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    phone: string;
}