import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostMetaDto {
    @IsString()
    @IsNotEmpty()
    readTime: string
}