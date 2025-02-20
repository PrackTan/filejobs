import { Transform, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsObject, ValidateNested, IsNotEmptyObject, IsString, IsBoolean, IsDateString, IsDate } from "class-validator";
import mongoose from "mongoose";
class Company {
    @IsNotEmpty({ message: 'ID công ty không được để trống' })
    _id: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({ message: 'Tên công ty không được để trống' })
    name: string;

}
export class CreateJobDto {
    @IsNotEmpty({ message: 'Tên công việc không được để trống' })
    name: string;
    @IsNotEmpty({ message: 'Kỹ năng không được để trống' })
    @IsArray({ message: 'Kỹ năng phải là mảng' })
    @IsString({ each: true, message: 'Kỹ năng phải là chuỗi' })
    skills: string[];
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
    @IsNotEmpty({ message: 'Địa điểm không được để trống' })
    location: string;
    @IsNotEmpty({ message: 'Mức lương không được để trống' })
    salary: number;
    @IsNotEmpty({ message: 'Số lượng tuyển dụng không được để trống' })
    quantity: number;
    @IsNotEmpty({ message: 'Cấp bậc công việc không được để trống' })
    level: string;
    description: string;
    @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
    @IsDate()
    @Transform(({ value }) => new Date(value))
    startDate: Date;
    @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
    @IsDate()
    @Transform(({ value }) => new Date(value))
    endDate: Date;
    @IsNotEmpty({ message: 'Trạng thái không được để trống' })
    @IsBoolean({ message: 'Trạng thái phải là boolean' })
    isActive: boolean;

}
