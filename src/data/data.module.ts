import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/schemas/user.schema';
import { Permission } from 'src/permissions/schema/permission.schema';
import { PermissionSchema } from 'src/permissions/schema/permission.schema';
import { Roles, RolesSchema } from 'src/roles/schema/role.schema';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Roles.name, schema: RolesSchema }
    ])
  ], // Đăng ký mô hình User với MongooseModule
  controllers: [DataController],
  providers: [DataService, UserService, PermissionsService, RolesService],
})
export class DataModule { }
