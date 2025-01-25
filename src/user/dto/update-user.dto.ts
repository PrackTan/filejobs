import { OmitType, PartialType } from '@nestjs/mapped-types'; // Import PartialType từ @nestjs/mapped-types
import { CreateUserDto } from './create-user.dto'; // Import CreateUserDto từ file create-user.dto

// Định nghĩa class UpdateUserDto kế thừa từ PartialType với tham số là CreateUserDto
// PartialType là một hàm tiện ích của @nestjs/mapped-types, nó sẽ tạo ra một class mới với tất cả các thuộc tính của CreateUserDto nhưng tất cả đều là tùy chọn (optional)
//  export class UpdateUserDto extends PartialType(CreateUserDto) {}
// Định nghĩa class UpdateUserDto kế thừa từ OmitType với tham số là CreateUserDto và loại bỏ thuộc tính 'password'
// OmitType là một hàm tiện ích của @nestjs/mapped-types, nó sẽ tạo ra một class mới với tất cả các thuộc tính của CreateUserDto nhưng loại bỏ các thuộc tính được chỉ định
export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
    _id: string; // Định nghĩa thuộc tính _id kiểu string
}
