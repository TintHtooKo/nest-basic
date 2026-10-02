import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class CreateTagDto{
    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    label:string

    @IsString()
    @IsOptional()
    description:string
}