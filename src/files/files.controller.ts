import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FilesService } from './files.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('upload') // Định nghĩa một route POST với đường dẫn 'upload'
  @UseInterceptors(FileInterceptor('file')) // Sử dụng interceptor FileInterceptor để xử lý file upload, 'file' là tên field sử dụng trong form-data
  uploadFile(@UploadedFile( // Định nghĩa một tham số cho phương thức uploadFile, sử dụng decorator @UploadedFile để lấy file được upload
    new ParseFilePipeBuilder() // Tạo một ParseFilePipeBuilder để xây dựng các validator cho file
      .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 }) // Thêm validator kiểm tra kích thước tối đa của file là 5MB
      .addFileTypeValidator({ fileType: 'image/*' }) // Thêm validator kiểm tra loại file phải là hình ảnh
      .build({ // Xây dựng ParseFilePipe với các validator đã thêm
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY // Đặt mã trạng thái HTTP trả về khi có lỗi là 422 Unprocessable Entity
      })
  ) file: Express.Multer.File) { // Định nghĩa kiểu của tham số file là Express.Multer.File
    console.log(file); // In thông tin file ra console
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
