import { Injectable, HttpException, HttpStatus } from '@nestjs/common'; // Import HttpException và HttpStatus từ @nestjs/common
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto'; // Import CreateUserDto từ thư mục dto
import { UpdateUserDto } from './dto/update-user.dto'; // Import UpdateUserDto từ thư mục dto
import { InjectModel } from '@nestjs/mongoose'; // Import InjectModel từ @nestjs/mongoose
import { User as UserM, UserDocument } from './schemas/user.schema'; // Import User từ thư mục schemas
import mongoose, { Model } from 'mongoose'; // Import Model từ mongoose
import * as bcrypt from 'bcryptjs'; // Import thư viện bcryptjs để mã hóa mật khẩu
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { IUser } from 'src/Interface/users.interface';

@Injectable() // Đánh dấu class này có thể được tiêm vào các class khác
export class UserService {
  constructor(
    @InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>
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
  async create(createUserDto: CreateUserDto, iuser: any) { // Phương thức tạo người dùng mới
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
        createBy: {
          _id: iuser._id,
          name: iuser.email
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { _id: user._id, createdAt: user.createdAt }; // Trả về thông báo thành công
    } catch (error) {
      throw new HttpException('Lỗi khi tạo người dùng', HttpStatus.INTERNAL_SERVER_ERROR); // Ném lỗi nếu có lỗi xảy ra
    }
  }

  async findAll(currentPage: string, limit: string, query: string) { // Phương thức tìm tất cả người dùng
    const { filter, sort, projection, population } = aqp(query) // Phân tích query để lấy ra các thông tin lọc, sắp xếp, chọn trường và populate
    delete filter.current // Xóa thuộc tính page khỏi filter để tránh ảnh hưởng đến việc tìm kiếm
    delete filter.pageSize // Xóa thuộc tính pageSize khỏi filter để tránh ảnh hưởng đến việc tìm kiếm
    let offset = (+currentPage - 1) * (+limit); // Tính toán vị trí bắt đầu (offset) cho việc phân trang dựa trên số trang và giới hạn
    let defaultLimit = +limit ? +limit : 10; // Đặt giới hạn mặc định cho số lượng mục trên mỗi trang, nếu không có limit thì mặc định là 10
    const totalItems = (await this.userModel.countDocuments(filter)) // Đếm tổng số mục theo điều kiện filter để biết có bao nhiêu mục thỏa mãn
    const totalPage = Math.ceil(totalItems / defaultLimit) // Tính tổng số trang dựa trên tổng số mục và giới hạn mỗi trang
    const result = await this.userModel.find(filter) // Tìm các mục theo điều kiện filter
      .skip(offset) // Bỏ qua các mục đã được phân trang trước đó để lấy đúng mục cho trang hiện tại
      .limit(defaultLimit) // Giới hạn số lượng mục trả về theo defaultLimit để đảm bảo chỉ lấy số lượng cần thiết
      .sort(sort as any) // Sắp xếp các mục theo điều kiện sort để đảm bảo thứ tự mong muốn
      .select('-password') // Chọn các trường cần thiết theo projection để chỉ lấy dữ liệu cần thiết
      .populate(population) // Populate các trường liên quan theo population để lấy dữ liệu liên quan từ các bảng khác
    return { // Trả về kết quả bao gồm thông tin phân trang và danh sách kết quả
      meta: {
        current: +currentPage, // Trang hiện tại để biết người dùng đang ở trang nào
        pageSize: +limit, // Số lượng mục trên mỗi trang để biết giới hạn mỗi trang
        itemsPerPage: defaultLimit, // Số lượng mục trên mỗi trang để biết giới hạn mỗi trang
        totalItems, // Tổng số mục để biết có bao nhiêu mục thỏa mãn điều kiện
        totalPages: totalPage // Tổng số trang để biết có bao nhiêu trang tất cả
      },
      result // Danh sách kết quả để trả về các mục tìm được
    }
  }

  async findOne(id: string) { // Phương thức tìm một người dùng theo id
    if (!mongoose.Types.ObjectId.isValid(id)) { // Kiểm tra id có hợp lệ không
      throw new HttpException('Id không hợp lệ', HttpStatus.BAD_REQUEST); // Ném lỗi nếu id không hợp lệ
    }
    const user = await this.userModel.findById(id).select('-password').populate({ path: 'role', select: { name: 1, _id: 1 } }); // Tìm người dùng theo id
    if (!user) {
      throw new HttpException('Không tìm thấy người dùng', HttpStatus.NOT_FOUND); // Ném lỗi nếu không tìm thấy người dùng
    }
    return user; // Trả về người dùng nếu tìm thấy
  }

  async findOneByEmail(email: string) { // Phương thức tìm một người dùng theo email
    const user = await this.userModel.findOne({ email: email }).populate({ path: 'role', select: { name: 1, permission: 1 } }); // Tìm người dùng theo email
    if (!user) {
      return null; // Trả về null nếu không tìm thấy người dùng
    }
    return user; // Trả về người dùng nếu tìm thấy
  }

  async isValidUserpassword(password: string, hash: string) { // Phương thức kiểm tra mật khẩu người dùng có hợp lệ không
    return bcrypt.compareSync(password, hash); // So sánh mật khẩu với hash
  }

  async update(updateUserDto: UpdateUserDto, iuser: any) { // Phương thức cập nhật người dùng theo id
    if (!mongoose.Types.ObjectId.isValid(updateUserDto._id)) { // Kiểm tra id có hợp lệ không
      throw new HttpException('Id không hợp lệ', HttpStatus.BAD_REQUEST); // Ném lỗi nếu id không hợp lệ
    }
    const userId = await this.userModel.findById(updateUserDto._id); // Tìm người dùng theo id
    if (!userId) {
      throw new HttpException('Không tìm thấy người dùng', HttpStatus.NOT_FOUND); // Ném lỗi nếu không tìm thấy người dùng
    }
    const userUpdate = await this.userModel.updateOne({ _id: updateUserDto._id }, {
      ...updateUserDto, updateBy: {
        _id: iuser._id,
        name: iuser.email
      }
    }); // Cập nhật người dùng
    // console.log("userUpdate", userUpdate); // In ra thông tin cập nhật
    return userUpdate; // Trả về thông tin cập nhật
  }

  async remove(id: string, iuser: any) { // Phương thức xóa người dùng theo id
    if (!mongoose.Types.ObjectId.isValid(id)) { // Kiểm tra id có hợp lệ không
      throw new HttpException('Id không đúng định dạng', HttpStatus.BAD_REQUEST); // Ném lỗi nếu id không hợp lệ
    }
    const user = await this.userModel.findOne({ _id: id });
    console.log("user", user);
    if (user) {
      if (user.role.toString() == "ADMIN") {
        throw new HttpException('Không thể xóa tài khoản admin', HttpStatus.BAD_REQUEST);
      }
      await this.userModel.updateOne({ _id: id }, {
        deleteBy: {
          _id: iuser._id,
          name: iuser.email
        }
      });
      return await this.userModel.softDelete({ _id: id }); // Xóa người dùng theo id
    }
    throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND); // Ném lỗi nếu người dùng không tồn tại
  }
  updateUserToken = async (refreshToken: string, id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) { // Kiểm tra id có hợp lệ không
      throw new HttpException('Id không hợp lệ', HttpStatus.BAD_REQUEST); // Ném lỗi nếu id không hợp lệ
    }
    const user = await this.userModel.updateOne({ _id: id }, { refreshToken: refreshToken });
    return user;
  }
  findUserByRefreshToken = async (refreshToken: string) => {
    const user = await this.userModel.findOne({ refreshToken: refreshToken });
    return user;
  }
}
