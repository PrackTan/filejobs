import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common"; // Import các hàm createParamDecorator, ExecutionContext và SetMetadata từ @nestjs/common

export const IS_PUBLIC_KEY = 'isPublic'; // Định nghĩa một hằng số IS_PUBLIC_KEY với giá trị là 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); // Định nghĩa một decorator Public sử dụng hàm SetMetadata để gán metadata với key là IS_PUBLIC_KEY và giá trị là true

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => { // Định nghĩa một decorator User sử dụng hàm createParamDecorator
    const request = ctx.switchToHttp().getRequest(); // Lấy đối tượng request từ ExecutionContext
    return request.user; // Trả về thông tin người dùng từ request
},
);