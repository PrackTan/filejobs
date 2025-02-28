import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
export type UserDocument = HydratedDocument<User>;

/// schema no-sql 
/// entity sql
@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    email: string;
    @Prop({ required: true })
    password: string;
    @Prop()
    address: string;
    @Prop()
    phone: string;
    @Prop()
    avatar: string;
    @Prop()
    gender: string;
    @Prop()
    role: mongoose.Types.ObjectId;
    @Prop({ type: Object })
    company: {
        _id: string;
        name: string;
        logo: string;
    }
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
    refreshToken: string;
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;


}

export const UserSchema = SchemaFactory.createForClass(User);
// UserSchema.plugin(softDeletePlugin); // Kích hoạt soft-delete plugin
