import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) { }
  async create(createPermissionDto: CreatePermissionDto, user: any) {
    console.log("check user", user);
    const apiPath = await this.permissionModel.findOne({
      apiPath: createPermissionDto.apiPath,
      method: createPermissionDto.method,
    });
    if (apiPath) {
      throw new BadRequestException(`Đường dẫn API ${apiPath.apiPath}, phương thức ${apiPath.method} đã tồn tại`);
    }
    const permission = await this.permissionModel.create({
      ...createPermissionDto,
      createBy: {
        _id: user._id,
        name: user.name,
      },
    });

    return { _id: permission._id, createdAt: permission.createdAt };
  }

  async findAll(currentPage: string, limit: string, query: string) {
    const { filter, sort, projection, population } = aqp(query);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = await this.permissionModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.permissionModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select(projection)
      .populate(population);
    // Trả về thông tin phân trang và kết quả tìm kiếm
    return {
      meta: {
        current: +currentPage,
        pageSize: +limit,
        totalItems,
        totalPages
      },
      result
    }
  }

  async findOne(id: string) {
    const permission = await this.permissionModel.findById(id);
    if (!permission) {
      throw new NotFoundException('Quyền không tồn tại');
    }
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: any) {
    const permission = await this.permissionModel.findById(id);
    if (!permission) {
      throw new NotFoundException('Quyền không tồn tại');
    }
    return await this.permissionModel.updateOne(
      { _id: id },
      {
        ...updatePermissionDto,
        updateBy: {
          _id: user._id,
          name: user.name,
        },
      });
  }

  async remove(id: string) {
    const permission = await this.permissionModel.findById(id);
    if (!permission) {
      throw new NotFoundException('Quyền không tồn tại');
    }
    return await this.permissionModel.softDelete({ _id: id });
  }
}
