// Import Injectable từ @nestjs/common để đánh dấu class này có thể được tiêm vào các class khác.
import { Injectable } from '@nestjs/common';
// Import CreateCompanyDto từ thư mục dto để sử dụng cho việc tạo công ty.
import { CreateCompanyDto } from './dto/create-company.dto';
// Import UpdateCompanyDto từ thư mục dto để sử dụng cho việc cập nhật công ty.
import { UpdateCompanyDto } from './dto/update-company.dto';
// Import InjectModel từ @nestjs/mongoose để tiêm mô hình Mongoose vào service.
import { InjectModel } from '@nestjs/mongoose';
// Import Company và CompanyDocument từ schema để sử dụng cho mô hình công ty.
import { Company, CompanyDocument } from './schema/company.schema';
// Import Model từ mongoose để làm việc với mô hình Mongoose.
import mongoose, { Model } from 'mongoose';
// Import ResponseDto từ thư mục dto để định dạng phản hồi.
import { ResponseDto } from 'src/user/dto/reponse';
// Import SoftDeleteModel từ soft-delete-plugin-mongoose để hỗ trợ xóa mềm.
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/users.interface';

// Sử dụng decorator Injectable để đánh dấu class này có thể được tiêm vào các class khác.
@Injectable()
export class CompaniesService {
  // Khởi tạo constructor với InjectModel để tiêm mô hình công ty vào service.
  constructor(
    // Sử dụng InjectModel để lấy mô hình công ty từ Mongoose.
    @InjectModel(Company.name) 
    // Khai báo companyModel là một SoftDeleteModel của CompanyDocument.
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  // Phương thức create để tạo một công ty mới.
  async create(createCompanyDto: CreateCompanyDto,user:IUser) {
    // Tạo một đối tượng công ty mới từ companyModel với dữ liệu từ createCompanyDto.
    const company = await new this.companyModel({...createCompanyDto,createBy:{
      _id:user._id,
      name:user.name 
    }}).save()
    // Lưu đối tượng công ty vào cơ sở dữ liệu.
    company.save()
    // Trả về một đối tượng ResponseDto với mã 200 và thông báo thành công.
    return new ResponseDto(200, 'Tạo công ty thành công', company);
  }

  // Phương thức findAll để lấy tất cả các công ty.
  findAll() {
    // Trả về một chuỗi thông báo rằng hành động này trả về tất cả các công ty.
    return `This action returns all companies`;
  }

  // Phương thức findOne để lấy một công ty theo id.
  findOne(id: number) {
    // Trả về một chuỗi thông báo rằng hành động này trả về một công ty với id cụ thể.
    return `This action returns a #${id} company`;
  }

  // Phương thức update để cập nhật một công ty theo id.
  async update(id: number, updateCompanyDto: UpdateCompanyDto,user:IUser) {
   if(!mongoose.Types.ObjectId.isValid(updateCompanyDto._id)){
    return new ResponseDto(400, 'Id không hợp lệ', null);
   }
   const company = await this.companyModel.findById(updateCompanyDto._id)
   if(company){
    company.updateOne({...updateCompanyDto,updateBy:{
      _id:user._id,
      name:user.name
    }})
    return new ResponseDto(200, 'Cập nhật công ty thành công', company);
   }
   return new ResponseDto(404, 'Công ty không tồn tại', null);
  }

  // Phương thức remove để xóa một công ty theo id.
  async remove(id: string) { // Phương thức xóa người dùng theo id
    if(!mongoose.Types.ObjectId.isValid(id)){ // Kiểm tra id có hợp lệ không
      return new ResponseDto(400, 'Id không hợp lệ', null); // Trả về lỗi nếu id không hợp lệ
    }
    const companyDelete = await this.companyModel.softDelete({_id: id}); // Xóa người dùng theo id
    return new ResponseDto(200, 'Xóa người dùng thành công', companyDelete); // Trả về thông báo thành công
  }
}
