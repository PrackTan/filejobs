import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/customizeDecoratior';
import { Public } from 'src/decorator/customizeDecoratior';
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }
  @Public()
  @ResponseMessage('Create a new permission')
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user: any) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage('Get list permission with pagination')
  findAll(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query('query') query: string) {
    return this.permissionsService.findAll(currentPage, limit, query);
  }

  @Get(':id')
  @ResponseMessage('Get permission by id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update permission by id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: any) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete permission by id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
