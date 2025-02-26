import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { ResumeStatus } from "src/enum/resume-status.enum";
export type ResumeDocument = HydratedDocument<Resume>;

/// schema no-sql 
/// entity sql
@Schema({ timestamps: true })
export class Resume {
    @Prop()
    email: string;
    @Prop()
    userId: mongoose.Schema.Types.ObjectId;
    @Prop()
    url: string;
    @Prop()
    address: string;
    @Prop({ type: String, enum: ResumeStatus, default: ResumeStatus.PENDING })
    status: ResumeStatus;
    @Prop()
    companyId: mongoose.Schema.Types.ObjectId;
    @Prop()
    jobId: mongoose.Schema.Types.ObjectId;
    // Định nghĩa một thuộc tính history là một mảng các đối tượng
    @Prop({ type: mongoose.Schema.Types.Array })
    history:
        {
            // Trạng thái của lịch sử
            status: string;
            // Thời gian cập nhật
            updatedAt: Date;
            // Thông tin người cập nhật
            updatedBy: {
                // ID của người cập nhật
                _id: mongoose.Schema.Types.ObjectId;
                // Tên của người cập nhật
                name: string;
            }
        }[]

    @Prop({ type: Object })
    createdBy: {
        _id: ObjectId;
        name: string;
    }
    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    }
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;
    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    }
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
// UserSchema.plugin(softDeletePlugin); // Kích hoạt soft-delete plugin
