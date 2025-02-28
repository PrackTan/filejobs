import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { ObjectType } from "@nestjs/graphql";
export type PermissionDocument = HydratedDocument<Permission>;

/// schema no-sql 
/// entity sql
@Schema({ timestamps: true })
@ObjectType()
export class Permission {

    @Prop({ required: true })
    name: string;
    @Prop()
    apiPath: string;
    @Prop()
    module: string;
    @Prop()
    method: string;
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

export const PermissionSchema = SchemaFactory.createForClass(Permission);