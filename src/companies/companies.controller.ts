import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'; // Import các decorator cần thiết từ @nestjs/common
import { CompaniesService } from './companies.service'; // Import service CompaniesService để xử lý logic nghiệp vụ
import { CreateCompanyDto } from './dto/create-company.dto'; // Import DTO để tạo công ty
import { UpdateCompanyDto } from './dto/update-company.dto'; // Import DTO để cập nhật công ty
import { RequestDto } from 'src/user/dto/request'; // Import DTO cho request
import { ResponseMessage, User } from 'src/decorator/customizeDecoratior'; // Import decorator User để lấy thông tin người dùng
import { IUser } from 'src/Interface/users.interface'; // Import interface IUser để định nghĩa cấu trúc dữ liệu người dùng

@Controller('companies') // Đánh dấu lớp này là một controller với route gốc là 'companies'
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { } // Khởi tạo controller với service CompaniesService

  @Post() // Định nghĩa route POST để tạo công ty mới
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) { // Phương thức create nhận dữ liệu từ body và thông tin người dùng
    console.log("user check>>>>>", user); // In ra thông tin người dùng để kiểm tra
    return this.companiesService.create(createCompanyDto, user); // Gọi service để tạo công ty mới
  }
  @ResponseMessage('Lấy thông tin công ty theo page, limit ')
  @Get() // Định nghĩa route GET để lấy danh sách tất cả công ty
  findAll(@Query() query: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.companiesService.findAll(query, page, limit); // Gọi service để lấy danh sách công ty
  }

  @Get(':id') // Định nghĩa route GET để lấy thông tin công ty theo id
  findOne(@Param('id') id: string) { // Phương thức findOne nhận id từ param
    return this.companiesService.findOne(+id); // Gọi service để lấy thông tin công ty theo id
  }

  @Patch() // Định nghĩa route PATCH để cập nhật thông tin công ty theo id
  update(@Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) { // Phương thức update nhận id, dữ liệu cập nhật và thông tin người dùng
    return this.companiesService.update(updateCompanyDto, user); // Gọi service để cập nhật công ty
  }

  @Delete(':id') // Định nghĩa route DELETE để xóa công ty theo id
  remove(@Param('id') id: string, @User() user: any) { // Phương thức remove nhận id từ param
    return this.companiesService.remove(id, user); // Gọi service để xóa công ty
  }
}
