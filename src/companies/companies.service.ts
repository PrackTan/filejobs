// Import Injectable từ @nestjs/common để đánh dấu class này có thể được tiêm vào các class khác.
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
// Import SoftDeleteModel từ soft-delete-plugin-mongoose để hỗ trợ xóa mềm.
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
// Import IUser từ thư mục Interface để sử dụng cho việc định nghĩa cấu trúc dữ liệu người dùng.
import { IUser } from 'src/Interface/users.interface';
// Import aqp từ api-query-params để phân tích cú pháp query.
import aqp from 'api-query-params';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

// Sử dụng decorator Injectable để đánh dấu class này có thể được tiêm vào các class khác.
@Injectable()
export class CompaniesService {
  // Khởi tạo constructor với InjectModel để tiêm mô hình công ty vào service.
  constructor(
    // Sử dụng InjectModel để lấy mô hình công ty từ Mongoose.
    @InjectModel(Company.name)
    // Khai báo companyModel là một SoftDeleteModel của CompanyDocument.
    private companyModel: SoftDeleteModel<CompanyDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  // Phương thức create để tạo một công ty mới.
  async create(createCompanyDto: CreateCompanyDto, user: any) { // interface any mới chạy được
    // Tạo một đối tượng công ty mới từ companyModel với dữ liệu từ createCompanyDto.
    const company = await new this.companyModel({
      ...createCompanyDto,
      createBy: {
        _id: user._id,
        name: user.email
      }
    }).save()
    // Lưu đối tượng công ty vào cơ sở dữ liệu.
    company.save()
    // Trả về đối tượng công ty đã tạo.
    return company;
  }

  // Phương thức findAll để lấy tất cả các công ty.
  async findAll(query: any, current: number, pageSize: number) {
    // Sử dụng thư viện api-query-params để phân tích cú pháp query thành các phần tử filter, sort, projection, và population.
    const { filter, sort, projection, population } = aqp(query)
    // Xóa các thuộc tính page và limit khỏi filter vì chúng không cần thiết cho việc lọc dữ liệu.
    delete filter.current
    delete filter.pageSize
    // Tính toán offset dựa trên số trang và giới hạn.
    let offset = (current - 1) * (+pageSize);
    // Đặt giới hạn mặc định là 10 nếu limit không được cung cấp.
    let defaultLimit = +pageSize ? +pageSize : 10;

    // Đếm tổng số mục dựa trên filter.
    const totalItems = (await this.companyModel.countDocuments(filter))
    // Tính toán tổng số trang dựa trên tổng số mục và giới hạn mặc định.
    const totalPage = Math.ceil(totalItems / defaultLimit)
    // Tìm các công ty dựa trên filter, offset, limit, sort, projection, và population.
    const result = await this.companyModel.find(filter) // Tìm các công ty dựa trên filter
      .skip(offset) // Bỏ qua một số mục dựa trên offset
      .limit(defaultLimit) // Giới hạn số lượng mục trả về dựa trên defaultLimit
      .sort(sort as any) // Sắp xếp các mục dựa trên sort
      .select(projection) // Chọn các trường cần thiết dựa trên projection
      .populate(population) // Điền dữ liệu các trường liên quan dựa trên population
    // Trả về đối tượng chứa thông tin meta và kết quả.
    return {
      meta: {
        current: current, // Trang hiện tại
        itemCount: totalItems, // Tổng số mục
        itemsPerPage: defaultLimit, // Số mục trên mỗi trang
        totalItems, // Tổng số mục
        totalPages: totalPage // Tổng số trang
      },
      result
    }

  }

  // Phương thức findOne để lấy một công ty theo id.
  async findOne(id: string) {
    // Kiểm tra tính hợp lệ của ObjectId.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    // Tìm công ty theo id.
    const company = await this.companyModel.findById(id)
    if (company) {
      return company;
    }
    // Trả về một chuỗi thông báo rằng hành động này trả về một công ty với id cụ thể.
    throw new NotFoundException('Công ty không tồn tại');
  }

  // Phương thức update để cập nhật một công ty theo id.
  async update(updateCompanyDto: UpdateCompanyDto, user: any) {
    // Kiểm tra tính hợp lệ của ObjectId.
    if (!mongoose.Types.ObjectId.isValid(updateCompanyDto._id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    // Tìm công ty theo id.
    const company = await this.companyModel.findById(updateCompanyDto._id)
    if (company) {
      // Cập nhật công ty với dữ liệu mới và thông tin người cập nhật.
      await company.updateOne({ _id: updateCompanyDto._id }, {
        ...updateCompanyDto,

        updateBy: {
          _id: user._id,
          name: user.email
        }
      })
      return company;
    }
    // Trả về thông báo lỗi nếu công ty không tồn tại.
    throw new NotFoundException('Công ty không tồn tại');
  }

  // Phương thức remove để xóa một công ty theo id.
  async remove(id: string, user: any) { // Phương thức xóa người dùng theo id

    // Tìm công ty theo id.
    const company = await this.companyModel.findOne({ _id: id });
    if (company) {
      // Cập nhật thông tin người xóa.
      await this.companyModel.updateOne({ _id: id }, {
        deleteBy: {
          _id: user._id,
          name: user.email
        }
      })
      // Xóa mềm công ty và trả về thông báo thành công.
      return await this.companyModel.softDelete({ _id: id });
    }
    // Trả về thông báo lỗi nếu công ty không tồn tại.
    throw new NotFoundException('Công ty không tồn tại');

  }
}
