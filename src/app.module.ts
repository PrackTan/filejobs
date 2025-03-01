import { Module } from '@nestjs/common'; // Import Module từ thư viện @nestjs/common để định nghĩa một module trong NestJS
import { AppController } from './app.controller'; // Import AppController từ file app.controller để xử lý các yêu cầu HTTP
import { AppService } from './app.service'; // Import AppService từ file app.service để cung cấp các dịch vụ cho AppModule
import { UserModule } from './user/user.module'; // Import UserModule từ file user.module để quản lý người dùng
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule và ConfigService từ thư viện @nestjs/config để quản lý cấu hình
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule từ thư viện @nestjs/mongoose để kết nối với MongoDB
import { AuthModule } from './auth/auth.module'; // Import AuthModule từ file auth.module để quản lý xác thực
import { softDeletePlugin } from 'soft-delete-plugin-mongoose'; // Import softDeletePlugin từ thư viện soft-delete-plugin-mongoose để hỗ trợ xóa mềm
import { CompaniesModule } from './companies/companies.module'; // Import CompaniesModule để quản lý công ty
import { JobsModule } from './jobs/jobs.module'; // Import JobsModule để quản lý công việc
import { FilesModule } from './files/files.module'; // Import FilesModule để quản lý tệp tin
import { CloudinaryModule } from './cloudinary/cloudinary.module'; // Import CloudinaryModule để quản lý dịch vụ Cloudinary
import { CloudinaryController } from './cloudinary/cloudinary.controller'; // Import CloudinaryController để xử lý các yêu cầu liên quan đến Cloudinary
import { CloudinaryService } from './cloudinary/cloudinary.service'; // Import CloudinaryService để cung cấp các dịch vụ liên quan đến Cloudinary
import { ApolloDriver } from '@nestjs/apollo'; // Import ApolloDriver từ @nestjs/apollo để sử dụng Apollo Server
import { ApolloDriverConfig } from '@nestjs/apollo'; // Import ApolloDriverConfig để cấu hình Apollo Server
import { GraphQLModule } from '@nestjs/graphql'; // Import GraphQLModule từ @nestjs/graphql để sử dụng GraphQL
import { join } from 'path'; // Import join từ module path để xử lý đường dẫn
import { GameModule } from './game/game.module'; // Import GameModule để quản lý trò chơi
import { ResumesModule } from './resumes/resumes.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Sử dụng ApolloDriver cho GraphQL
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Tự động tạo file schema.gql trong thư mục src
      sortSchema: true, // Sắp xếp schema
      playground: true, // Bật GraphQL Playground để thử nghiệm API
    }),
    ConfigModule.forRoot({ isGlobal: true }), // Đăng ký ConfigModule và cấu hình nó là global để có thể sử dụng ở mọi nơi
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Đăng ký ConfigModule để sử dụng trong MongooseModule
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // Lấy URI của MongoDB từ ConfigService
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin); // Sử dụng plugin softDeletePlugin cho kết nối
          return connection; // Trả về kết nối đã được cấu hình
        },
      }),
      inject: [ConfigService], // Tiêm ConfigService vào useFactory để sử dụng
    }),
    UserModule, // Đăng ký UserModule để sử dụng trong AppModule
    AuthModule, // Đăng ký AuthModule để sử dụng trong AppModule
    CompaniesModule, // Đăng ký CompaniesModule để sử dụng trong AppModule
    JobsModule, // Đăng ký JobsModule để sử dụng trong AppModule
    FilesModule, // Đăng ký FilesModule để sử dụng trong AppModule
    CloudinaryModule, // Đăng ký CloudinaryModule để sử dụng trong AppModule
    GameModule, ResumesModule, PermissionsModule, RolesModule, DataModule, // Đăng ký GameModule để sử dụng trong AppModule

  ],
  controllers: [
    AppController, // Đăng ký AppController để xử lý các yêu cầu HTTP
    CloudinaryController, // Đăng ký CloudinaryController để xử lý các yêu cầu liên quan đến Cloudinary
  ],
  providers: [
    AppService, // Đăng ký AppService để cung cấp các dịch vụ cho AppModule
    CloudinaryService, // Đăng ký CloudinaryService để cung cấp các dịch vụ liên quan đến Cloudinary
    // {
    //   provide: APP_GUARD, // Cung cấp APP_GUARD để bảo vệ các route
    //   useClass: JwtAuthGuard, // Sử dụng JwtAuthGuard để bảo vệ các route
    // },
  ],
})
export class AppModule { } // Định nghĩa AppModule là module chính của ứng dụng
