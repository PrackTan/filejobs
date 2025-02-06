import { Injectable } from '@nestjs/common'; // Import Injectable từ thư viện @nestjs/common
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard từ thư viện @nestjs/passport

@Injectable() // Đánh dấu lớp LocalAuthGuard là một service có thể được inject vào các nơi khác
export class LocalAuthGuard extends AuthGuard('local') {} // Định nghĩa lớp LocalAuthGuard kế thừa từ AuthGuard với chiến lược 'local'
