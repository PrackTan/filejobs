import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
export type JobDocument = HydratedDocument<Job>;

/// schema no-sql 
/// entity sql
@Schema({ timestamps: true })
export class Job {
    @Prop({ required: true })
    name: string;
    @Prop()
    skills: string[];
    @Prop()
    salary: number;
    @Prop()
    description: string;
    @Prop()
    location: string;
    @Prop()
    experience: string;
    @Prop()
    type: string;
    @Prop()
    quantity: number;
    @Prop()
    level: string;
    @Prop()
    companyId: mongoose.Schema.Types.ObjectId;
    @Prop()
    startDate: Date;
    @Prop()
    endDate: Date;
    @Prop()
    isActive: boolean;
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

export const JobSchema = SchemaFactory.createForClass(Job);