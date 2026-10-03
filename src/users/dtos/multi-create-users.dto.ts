import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { CreateUserDto } from "./create.user.dto";
import { Type } from "class-transformer";

export class CreateMultiUserDto{
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({each:true})
    @Type(() => CreateUserDto)
    users: CreateUserDto[]
}