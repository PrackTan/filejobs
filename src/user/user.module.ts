import { Module } from '@nestjs/common'; // Import Module từ @nestjs/common
import { UserService } from './user.service'; // Import UserService từ file user.service
import { UserController } from './user.controller'; // Import UserController từ file user.controller
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule từ @nestjs/mongoose
import { UserSchema } from './schemas/user.schema'; // Import UserSchema từ file user.schema

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])], // Đăng ký mô hình User với MongooseModule
  controllers: [UserController], // Đăng ký UserController
  providers: [UserService], // Đăng ký UserService
})
export class UserModule {} // Định nghĩa UserModule