import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { ResumeStatus } from 'src/enum/resume-status.enum';
import { IsArray, IsEnum, IsNotEmpty, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';


class updateBy {
    @IsNotEmpty({ message: '_id không được để trống' })
    @IsString({ message: '_id phải là string' })
    _id: string;
    @IsNotEmpty({ message: 'name không được để trống' })
    @IsString({ message: 'name phải là string' })
    name: string;
}
class history {
    @IsEnum(ResumeStatus)
    @IsNotEmpty({ message: 'status không được để trống' })
    @IsString({ message: 'status phải là string' })
    status: ResumeStatus;
    @IsNotEmpty({ message: 'updatedAt không được để trống' })
    @IsString({ message: 'updatedAt phải là string' })
    updatedAt: string;
    @IsNotEmpty({ message: 'updatedBy không được để trống' })
    @IsString({ message: 'updatedBy phải là string' })
    updatedBy: updateBy;
}
export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    @IsNotEmpty({ message: 'history không được để trống' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => history)
    history: history[];
}
