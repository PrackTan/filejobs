import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Roles } from 'src/roles/schema/role.schema';
import { Permission } from 'src/permissions/schema/permission.schema';
import { User } from 'src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';
import { PermissionDocument } from 'src/permissions/schema/permission.schema';
import { RolesDocument } from 'src/roles/schema/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';
@Injectable()
export class DataService implements OnModuleInit {
    private readonly logger = new Logger(DataService.name);
    constructor(
        @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
        @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
        @InjectModel(Roles.name) private roleModel: SoftDeleteModel<RolesDocument>,
        private configService: ConfigService,
        private userService: UserService,

    ) { }
    async onModuleInit() {
        const isInitialized = this.configService.get('IS_INITIALIZED');
        if (Boolean(isInitialized)) {
            const countUser = await this.userModel.countDocuments({});
            const countPermission = await this.permissionModel.countDocuments({});
            const countRole = await this.roleModel.countDocuments({});
            if (countUser === 0) {
                await this.permissionModel.insertMany("INITIAL_PERMISSIONS");
            }
            if (countRole === 0) {
                const permissions = await this.permissionModel.find({}).select('_id');
                await this.roleModel.insertMany("INITIAL_ROLES");
            }
            if (countPermission === 0) {
                await this.permissionModel.insertMany("INITIAL_PERMISSIONS");
            }
        } else {
            this.logger.log('The data service is not initialized');
        }
    }

}
