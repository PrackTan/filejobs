import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

// CreateCompanyDto class is used to define the structure and validation rules for creating a new Company.
export class CreateCompanyDto {
    _id: string;
    // The email field must be a valid email address.
    @IsNotEmpty({ message: 'Tên công ty không được để trống' })
    name: string;
    @IsOptional()
    logo: string;


    // The password field must not be empty and must have a minimum length of 8 characters.
    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    address: string;


    description: string;

}
