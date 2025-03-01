import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Roles } from './schema/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { RolesDocument } from './schema/role.schema';
import aqp from 'api-query-params';
@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles.name) private roleModel: SoftDeleteModel<RolesDocument>,
  ) { }
  async create(createRoleDto: CreateRoleDto, user: any) {
    const { name, description, permissions } = createRoleDto;
    const nameExist = await this.roleModel.findOne({ name });
    if (nameExist) {
      throw new BadRequestException('Tên vai trò đã tồn tại');
    }
    const role = await this.roleModel.create({
      name,
      description,
      permissions,
      createBy: {
        _id: user._id,
        name: user.name,
      },
    });
    return { _id: role._id, createdAt: role.createdAt };
  }

  async findAll(currentPage: string, limit: string, query: string) {
    const { filter, sort, projection, population } = aqp(query);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = await this.roleModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.roleModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select(projection)
      .populate(population);
    return {
      meta: {
        current: +currentPage,
        pageSize: +limit,
        totalItems,
        totalPages
      },
      result
    };
  }

  async findOne(id: string) {
    const role = await this.roleModel.findById(id).populate({
      path: 'permissions',
      select: {
        _id: 1,
        name: 1,
        description: 1,
        module: 1,
      },
    });
    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: any) {
    const { name, description, permissions } = updateRoleDto;
    const findRole = await this.roleModel.findById(id);
    if (!findRole) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    return await this.roleModel.updateOne({ _id: id }, {
      name, description, permissions, updateBy: {
        _id: user._id,
        name: user.name,
      },
    });
  }

  async remove(id: string) {
    const role = await this.roleModel.findById(id);
    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    if (role.name == "ADMIN") {
      throw new HttpException('Không thể xóa vai trò admin', HttpStatus.BAD_REQUEST);
    }
    return await this.roleModel.softDelete({ _id: id });
  }
}
