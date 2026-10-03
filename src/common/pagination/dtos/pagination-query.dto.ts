import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    @IsPositive()
    @Type(()=>Number)
    limit: number;

    @IsOptional()
    @IsPositive()
    @Type(()=>Number)
    page: number;
}