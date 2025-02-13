import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common"; // Import các hàm createParamDecorator, ExecutionContext và SetMetadata từ @nestjs/common

export const IS_PUBLIC_KEY = 'isPublic'; // Tạo một hằng số IS_PUBLIC_KEY với giá trị là 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); // Tạo một decorator Public sử dụng SetMetadata để gán metadata với key là IS_PUBLIC_KEY và giá trị là true

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => { // Tạo một decorator User sử dụng createParamDecorator
    const request = ctx.switchToHttp().getRequest(); // Lấy đối tượng request từ ExecutionContext
    return request.user; // Trả về thông tin người dùng từ request
},
);
export const RESPONSE_MESSAGE = 'responseMessage';
// Tạo một decorator ResponseMessage sử dụng SetMetadata để gán metadata với 
// key là 'responseMessage' và giá trị là message
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message);