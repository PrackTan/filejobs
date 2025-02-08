import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
export type CompanyDocument = HydratedDocument<Company>;

/// schema no-sql 
/// entity sql
@Schema({timestamps: true})
export class Company {
    @Prop({required: true})
    name: string;
    @Prop()
    address: string;
    @Prop({required: true})
    phone: string;
    @Prop()
    email: string;
    @Prop()
    description: string;
    @Prop()
    website: string;
    @Prop({type: Object})
    createBy: {
        _id: string;
        name: string;
    };
    @Prop({type: Object})
    updateBy: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    };
    @Prop({type: Object})
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

export const CompanySchema = SchemaFactory.createForClass(Company);