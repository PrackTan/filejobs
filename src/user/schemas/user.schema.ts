import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
export type UserDocument = HydratedDocument<User>;

/// schema no-sql 
/// entity sql
@Schema()
export class User {
    @Prop({required: true})
    name: string;
    @Prop({required: true})
    email: string;
    @Prop({required: true})
    password: string;
    @Prop()
    address: string;
    @Prop()
    phone: string;
    @Prop()
    role: string;
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);