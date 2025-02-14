import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/decorator/customizeDecoratior';
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }
  @Post("signup")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
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
  update(@Body() updateUserDto: UpdateUserDto) {
    console.log("update id", updateUserDto._id);
    return this.userService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
