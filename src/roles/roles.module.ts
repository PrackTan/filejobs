import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesSchema } from './schema/role.schema';
import { Roles } from './schema/role.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: Roles.name, schema: RolesSchema }])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule { }
