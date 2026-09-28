import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from './dto/create.post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatchPostDto } from './dto/patch.post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService:PostsService){}
    @Get("/:userId")
    getPostsByUserId(@Param("userId") userId:string){
        return this.postService.getAllPosts(userId);
    }

    @ApiOperation({summary:"For create post"})
    @ApiResponse({status:201,description:"Created"})
    @Post()
    createPost(@Body() createPostDto:CreatePostDto){
        console.log(createPostDto);
    }

    @ApiOperation({summary:"For update post"})
    @ApiResponse({status:200,description:"Updated"})
    @Patch()
    updatePost(@Body() patchPostDto:PatchPostDto){
        console.log(patchPostDto);
    }
}
