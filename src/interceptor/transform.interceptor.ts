import {
    Injectable, // Import Injectable từ @nestjs/common để đánh dấu class có thể được tiêm vào các class khác
    NestInterceptor, // Import NestInterceptor từ @nestjs/common để triển khai interceptor
    ExecutionContext, // Import ExecutionContext từ @nestjs/common để truy cập ngữ cảnh thực thi
    CallHandler, // Import CallHandler từ @nestjs/common để xử lý các cuộc gọi
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs'; // Import Observable từ thư viện rxjs để làm việc với các luồng dữ liệu không đồng bộ
import { map } from 'rxjs/operators'; // Import map từ rxjs/operators để chuyển đổi dữ liệu trong luồng
import { RESPONSE_MESSAGE } from 'src/decorator/customizeDecoratior';

// Định nghĩa interface Response với các thuộc tính statusCode, message và data
export interface Response<T> {
    statusCode: number; // Thuộc tính statusCode kiểu số để lưu mã trạng thái HTTP
    message?: string; // Thuộc tính message kiểu chuỗi, có thể không có, để lưu thông điệp phản hồi
    data: any; // Thuộc tính data kiểu bất kỳ để lưu dữ liệu phản hồi
}

// Sử dụng decorator Injectable để đánh dấu class này có thể được tiêm vào các class khác giống như bean của Java Spring Boot
@Injectable()
// Định nghĩa class TransformInterceptor và triển khai NestInterceptor
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    // Phương thức intercept để can thiệp vào quá trình xử lý request và response
    constructor(private reflector: Reflector) { }
    intercept(
        context: ExecutionContext, // Tham số context để truy cập ngữ cảnh thực thi hiện tại
        next: CallHandler, // Tham số next để xử lý tiếp các cuộc gọi
    ): Observable<Response<T>> { // Trả về một Observable chứa đối tượng Response
        // Sử dụng pipe để chuyển đổi dữ liệu response
        return next
            .handle() // Xử lý tiếp cuộc gọi và lấy dữ liệu
            .pipe(
                map((data) => ({ // Sử dụng map để chuyển đổi dữ liệu
                    // Lấy statusCode từ response và gán vào đối tượng trả về
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    // Gán dữ liệu vào thuộc tính data của đối tượng trả về
                    message: this.reflector.get(RESPONSE_MESSAGE, context.getHandler()),
                    data: data
                })),
            );
    }
}
