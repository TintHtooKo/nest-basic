import { CreatePostDto } from "./create.post.dto";
import { IsInt, IsNotEmpty } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class PatchPostDto extends PartialType(CreatePostDto){
    @ApiProperty({example:1,description:"post id for update"})
    @IsInt()
    @IsNotEmpty()
    id:number
}