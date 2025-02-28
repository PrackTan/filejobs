import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
@InputType()
export class CreatePermissionDto {
    @IsNotEmpty()
    @Field(() => String)
    name: string;
    @IsNotEmpty()
    @Field(() => String)
    apiPath: string;
    @IsNotEmpty()
    @Field(() => String)
    module: string;
    @IsNotEmpty()
    @Field(() => String)
    method: string;
}
