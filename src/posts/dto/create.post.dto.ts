import { IsArray, IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MinLength, ValidateNested } from "class-validator";
import { postStatus } from "../enums/postStatus.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CreateTagDto } from "src/tags/dtos/create.tag.dto";
import { Type } from "class-transformer";
import { CreatePostMetaDto } from "src/post-meta/dtos/create.post-meta.dto";

export class CreatePostDto{
    @ApiProperty({
        example:"Test title",
        description:"This is for post title",
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    title:string;

    @ApiProperty({
        example:"test-title",
        description:"This is for post slug",
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,{
        message: 'Slug must be lowercase and contain only letters, numbers, and hyphens.'
    })
    slug:string;

    @ApiProperty({
        enum:postStatus,
        description:"This is for post status",
    })
    @IsEnum(postStatus)
    @IsNotEmpty()
    status:postStatus;

    @ApiProperty({
        example:"Test post content",
        description:"This is for post content",
    })
    @IsString()
    @IsNotEmpty()
    content:string;

    @ApiPropertyOptional({
        example:"https://example.com/image.jpg",
        description:"This is for post image url",
    })
    @IsUrl()
    @IsOptional()
    featureImgUrl:string;

    @ApiPropertyOptional({
        example:"2023-01-01T00:00:00.000Z",
        description:"This is for post date time",
    })
    @IsISO8601()
    @IsOptional()
    publishOn:string;

    @ApiPropertyOptional({
        example:[CreateTagDto],
        description:"This is for post tags",
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({each:true})
    @Type(()=>CreateTagDto)
    tags:CreateTagDto[];

    @ApiProperty({
        description:"This is for post meta",
        type: CreatePostMetaDto,
    })
    @ValidateNested()
    @Type(()=>CreatePostMetaDto)
    @IsNotEmpty()
    meta: CreatePostMetaDto

}