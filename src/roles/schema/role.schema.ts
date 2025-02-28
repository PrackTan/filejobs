import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { ObjectType } from "@nestjs/graphql";
import { Permission } from "src/permissions/schema/permission.schema";
export type RolesDocument = HydratedDocument<Roles>;

/// schema no-sql 
/// entity sql
@Schema({ timestamps: true })
@ObjectType()
export class Roles {

    @Prop({ required: true })
    name: string;
    @Prop()
    description: string;
    @Prop()
    isActive: boolean;
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Permission' }) // ref: 'Permission' là tên của model Permission [ObjectId] là kiểu dữ liệu của id
    permissions: Permission[];
    @Prop({ type: Object })
    createBy: {
        _id: string;
        name: string;
    };
    @Prop({ type: Object })
    updateBy: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    };
    @Prop({ type: Object })
    deleteBy: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    };
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;

}

export const RolesSchema = SchemaFactory.createForClass(Roles);