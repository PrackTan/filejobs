import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { Public, User } from 'src/decorator/customizeDecoratior';
import { IUser } from 'src/Interface/users.interface';
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }
  @Post("signup")
  create(@Body() createUserDto: CreateUserDto, @User() iuser: IUser) {
    return this.userService.create(createUserDto, iuser);
  }

  @Get()
  findAll(@Query() query: any, @Query("page") page: number, @Query("limit") limit: number) {
    return this.userService.findAll(query, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id); // +id là chuyển id sang số  
  }
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @User() iuser: IUser) {
    console.log("update id", updateUserDto._id);
    return this.userService.update(updateUserDto, iuser);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() iuser: IUser) {
    return this.userService.remove(id, iuser);
  }
}
