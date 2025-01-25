import { Injectable } from '@nestjs/common'; // Import Injectable từ @nestjs/common
import { CreateUserDto } from './dto/create-user.dto'; // Import CreateUserDto từ thư mục dto
import { UpdateUserDto } from './dto/update-user.dto'; // Import UpdateUserDto từ thư mục dto
import { InjectModel } from '@nestjs/mongoose'; // Import InjectModel từ @nestjs/mongoose
import { User } from './schemas/user.schema'; // Import User từ thư mục schemas
import mongoose, { Model } from 'mongoose'; // Import Model từ mongoose
import * as bcrypt from 'bcryptjs';
import { ResponseDto } from './dto/reponse';

@Injectable() // Đánh dấu class này có thể được tiêm vào các class khác
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User> 
  ) {} // Tiêm mô hình User vào constructor

  hashPassword = (plainPassword: string) => {
    const  salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(plainPassword, salt);
    return hash;
     
  }
  async create(createUserDto: CreateUserDto) { // Phương thức tạo người dùng mới
    const checkEmail = await this.userModel.findOne({email: createUserDto.email});
    if(checkEmail){
      return new ResponseDto(400, 'Email already exists', null);
    }
    const hashedPassword = this.hashPassword(createUserDto.password);
    // let user = new this.userModel({
    //   name: createUserDto.name,
    //   password: hashedPassword,
    //   email: createUserDto.email,
    //   address: createUserDto.address,
    //   phone: createUserDto.phone,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),

    // });
    // await user.save();

    try{
      let user = await this.userModel.create({
        name: createUserDto.name,
        password: hashedPassword,
        email: createUserDto.email,
        address: createUserDto.address,
        phone: createUserDto.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return new ResponseDto(200, 'User created successfully', user);
    }catch(error){
      return new ResponseDto(500, 'Internal server error', null);
    }
  }

  findAll() { // Phương thức tìm tất cả người dùng
    return `This action returns all user`; // Trả về thông báo hành động trả về tất cả người dùng
  }

  async findOne(id: string) { // Phương thức tìm một người dùng theo id
    if(!mongoose.Types.ObjectId.isValid(id)){
      return new ResponseDto(400, 'Invalid id', null);
    }
    const user = await this.userModel.findById(id);
    if(!user){
      return new ResponseDto(404, 'User not found', null);
    }
    return new ResponseDto(200, 'User found', user);
  }

  async update(updateUserDto: UpdateUserDto) { // Phương thức cập nhật người dùng theo id
    if(!mongoose.Types.ObjectId.isValid(updateUserDto._id)){
      return new ResponseDto(400, 'Invalid id', null);
    }
    const userId = await this.userModel.findById(updateUserDto._id);
    if(!userId){
      return new ResponseDto(404, 'User not found', null);
    }
    const userUpdate = await this.userModel.updateOne({_id: updateUserDto._id}, {...updateUserDto});
    console.log("userUpdate",userUpdate);
    return new ResponseDto(200, 'User updated successfully', userUpdate);
  }

  async remove(id: string) { // Phương thức xóa người dùng theo id
    if(!mongoose.Types.ObjectId.isValid(id)){
      return new ResponseDto(400, 'Invalid id', null);
    }
    const userDelete = await this.userModel.deleteOne({_id: id});
    return new ResponseDto(200, 'User deleted successfully', userDelete);
  }
}
