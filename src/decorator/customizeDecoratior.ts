import { SetMetadata } from "@nestjs/common"; // Import SetMetadata từ @nestjs/common

export const IS_PUBLIC_KEY = 'isPublic'; // Định nghĩa một hằng số IS_PUBLIC_KEY với giá trị 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); // Định nghĩa một decorator Public sử dụng SetMetadata để gán metadata với key là IS_PUBLIC_KEY và giá trị là true


