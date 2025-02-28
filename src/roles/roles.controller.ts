import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customizeDecoratior';
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @ResponseMessage('Create a new role')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @User() user: any) {
    return this.rolesService.create(createRoleDto, user);
  }

  @ResponseMessage('Get list role with pagination')
  @Get()
  findAll(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query('query') query: string) {
    return this.rolesService.findAll(currentPage, limit, query);
  }

  @ResponseMessage('Get role by id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @ResponseMessage('Update role by id')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: any) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @ResponseMessage('Delete role by id')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
