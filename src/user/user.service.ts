import { Injectable, HttpException, HttpStatus } from '@nestjs/common'; // Import HttpException và HttpStatus từ @nestjs/common
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto'; // Import CreateUserDto từ thư mục dto
import { UpdateUserDto } from './dto/update-user.dto'; // Import UpdateUserDto từ thư mục dto
import { InjectModel } from '@nestjs/mongoose'; // Import InjectModel từ @nestjs/mongoose
import { User, UserDocument } from './schemas/user.schema'; // Import User từ thư mục schemas
import mongoose, { Model } from 'mongoose'; // Import Model từ mongoose
import * as bcrypt from 'bcryptjs'; // Import thư viện bcryptjs để mã hóa mật khẩu
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable() // Đánh dấu class này có thể được tiêm vào các class khác
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ) { } // Tiêm mô hình User vào constructor

  hashPassword = (plainPassword: string) => { // Hàm mã hóa mật khẩu
    const salt = bcrypt.genSaltSync(10); // Tạo muối với độ dài 10
    const hash = bcrypt.hashSync(plainPassword, salt); // Mã hóa mật khẩu với muối
    return hash; // Trả về mật khẩu đã mã hóa
  }
  async register(registerUserDto: RegisterUserDto) {
    const checkEmail = await this.userModel.findOne({ email: registerUserDto?.email }); // Kiểm tra email đã tồn tại chưa
    if (checkEmail) {
      throw new HttpException('Email đã tồn tại', HttpStatus.CONFLICT); // Ném lỗi nếu email đã tồn tại
    }
    const hashedPassword = this.hashPassword(registerUserDto?.password); // Mã hóa mật khẩu
    try {
      let user = await this.userModel.create({ // Tạo người dùng mới
        name: registerUserDto?.name,
        password: hashedPassword,
        email: registerUserDto?.email,
        address: registerUserDto?.address,
        phone: registerUserDto?.phone,
        gender: registerUserDto?.gender,
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id: user._id, createdAt: user.createdAt }; // Trả về id người dùng mới tạo và ngày tạo
    } catch (error) {
      throw new HttpException('Lỗi khi tạo người dùng', HttpStatus.INTERNAL_SERVER_ERROR); // Ném lỗi nếu có lỗi xảy ra
    }
  }
  async create(createUserDto: CreateUserDto) { // Phương thức tạo người dùng mới
    const checkEmail = await this.userModel.findOne({ email: createUserDto.email }); // Kiểm tra email đã tồn tại chưa
    if (checkEmail) {
      throw new HttpException('Email đã tồn tại', HttpStatus.CONFLICT); // Ném lỗi nếu email đã tồn tại
    }
    const hashedPassword = this.hashPassword(createUserDto?.password); // Mã hóa mật khẩu
    try {
      let user = await this.userModel.create({ // Tạo người dùng mới
        name: createUserDto.name,
        password: hashedPassword,
        email: createUserDto.email,
        address: createUserDto.address,
        phone: createUserDto.phone,
        role: createUserDto.role,
        gender: createUserDto.gender,
        company: createUserDto.company,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { _id: user._id, createdAt: user.createdAt }; // Trả về thông báo thành công
    } catch (error) {
      throw new HttpException('Lỗi khi tạo người dùng', HttpStatus.INTERNAL_SERVER_ERROR); // Ném lỗi nếu có lỗi xảy ra
    }
  }

  async findAll(query: any, page: number, limit: number) { // Phương thức tìm tất cả người dùng
    const { filter, sort, projection, population } = aqp(query)
    delete filter.page
    delete filter.limit
    let offset = (page - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.countDocuments(filter))
    const totalPage = Math.ceil(totalItems / defaultLimit)
    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select(projection)
      .populate(population)
    return {
      meta: {
        currentPage: page,
        itemCount: totalItems,
        itemsPerPage: defaultLimit,
        totalItems,
        totalPages: totalPage
      },
      result
    }
  }

  async findOne(id: string) { // Phương thức tìm một người dùng theo id
    if (!mongoose.Types.ObjectId.isValid(id)) { // Kiểm tra id có hợp lệ không
      throw new HttpException('Id không hợp lệ', HttpStatus.BAD_REQUEST); // Ném lỗi nếu id không hợp lệ
    }
    const user = await this.userModel.findById(id); // Tìm người dùng theo id
    if (!user) {
      throw new HttpException('Không tìm thấy người dùng', HttpStatus.NOT_FOUND); // Ném lỗi nếu không tìm thấy người dùng
    }
    const { password, ...userWithoutPassword } = user.toObject(); // Loại bỏ password khỏi kết quả
    return userWithoutPassword; // Trả về người dùng nếu tìm thấy
  }

  async findOneByEmail(email: string) { // Phương thức tìm một người dùng theo email
    const user = await this.userModel.findOne({ email: email }); // Tìm người dùng theo email
    if (!user) {
      return null; // Trả về null nếu không tìm thấy người dùng
    }
    return user; // Trả về người dùng nếu tìm thấy
  }

  async isValidUserpassword(password: string, hash: string) { // Phương thức kiểm tra mật khẩu người dùng có hợp lệ không
    return bcrypt.compareSync(password, hash); // So sánh mật khẩu với hash
  }

  async update(updateUserDto: UpdateUserDto) { // Phương thức cập nhật người dùng theo id
    if (!mongoose.Types.ObjectId.isValid(updateUserDto._id)) { // Kiểm tra id có hợp lệ không
      throw new HttpException('Id không hợp lệ', HttpStatus.BAD_REQUEST); // Ném lỗi nếu id không hợp lệ
    }
    const userId = await this.userModel.findById(updateUserDto._id); // Tìm người dùng theo id
    if (!userId) {
      throw new HttpException('Không tìm thấy người dùng', HttpStatus.NOT_FOUND); // Ném lỗi nếu không tìm thấy người dùng
    }
    const userUpdate = await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto }); // Cập nhật người dùng
    // console.log("userUpdate", userUpdate); // In ra thông tin cập nhật
    return userUpdate; // Trả về thông tin cập nhật
  }

  async remove(id: string) { // Phương thức xóa người dùng theo id
    if (!mongoose.Types.ObjectId.isValid(id)) { // Kiểm tra id có hợp lệ không
      throw new HttpException('Id không đúng định dạng', HttpStatus.BAD_REQUEST); // Ném lỗi nếu id không hợp lệ
    }
    const user = await this.userModel.findOne({ _id: id });
    if (user) {
      await this.userModel.updateOne({ _id: id }, {
        deleteBy: {
          _id: user._id,
          name: user.name
        }
      });
      return await this.userModel.softDelete({ _id: id }); // Xóa người dùng theo id
    }
    throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND); // Ném lỗi nếu người dùng không tồn tại
  }
}
