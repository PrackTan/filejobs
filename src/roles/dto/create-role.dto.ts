import { InputType, Field } from "@nestjs/graphql";
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";
@InputType()
export class CreateRoleDto {
    @IsNotEmpty({ message: "Tên vai trò không được để trống" })
    @Field(() => String)
    name: string;
    @IsNotEmpty({ message: "Mô tả không được để trống" })
    @Field(() => String)
    description: string;
    @IsNotEmpty({ message: "Trạng thái không được để trống" })
    @IsBoolean()
    isActive: boolean;
    @IsNotEmpty({ message: "Quyền không được để trống" })
    @IsArray({ message: "Quyền phải là mảng" })
    @IsMongoId({ each: true, message: "Quyền phải là id" })
    @Field(() => [String])
    permissions: mongoose.Schema.Types.ObjectId[];
}
