import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customizeDecoratior';
import { IUser } from 'src/Interface/users.interface';
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }
  @Post("signup")
  @ResponseMessage('Create a new user')
  create(@Body() createUserDto: CreateUserDto, @User() iuser: IUser) {
    return this.userService.create(createUserDto, iuser);
  }

  @Get()
  @ResponseMessage('Get list users with pagination')
  findAll(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query('query') query: string) {
    return this.userService.findAll(currentPage, limit, query);
  }

  @Get(':id')
  @ResponseMessage('Get user by id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id); // +id là chuyển id sang số  
  }
  @Patch()
  @ResponseMessage('Update user by id')
  update(@Body() updateUserDto: UpdateUserDto, @User() iuser: IUser) {
    console.log("update id", updateUserDto._id);
    return this.userService.update(updateUserDto, iuser);
  }

  @Delete(':id')
  @ResponseMessage('Delete user by id')
  remove(@Param('id') id: string, @User() iuser: IUser) {
    return this.userService.remove(id, iuser);
  }
}
