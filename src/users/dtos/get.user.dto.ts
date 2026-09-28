import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class GetUserDto{
    @ApiProperty({example:1,description:"user id"})
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    id:number
}