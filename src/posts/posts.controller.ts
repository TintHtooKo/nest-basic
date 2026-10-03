import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from './dto/create.post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatchPostDto } from './dto/patch.post.dto';
import { GetPostDto } from './dto/get.post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService:PostsService){}
    @Get("/:userId")
    getPostsByUserId(@Param("userId") userId:string){
        return this.postService.getAllPostsById(userId);
    }

    @Get()
    getAllPosts(@Query() postQuery:GetPostDto){
        console.log(postQuery)
        return this.postService.findAllPost(postQuery);
    }

    @ApiOperation({summary:"For create post"})
    @ApiResponse({status:201,description:"Created"})
    @Post()
    createPost(@Body() createPostDto:CreatePostDto){
        return this.postService.addPost(createPostDto);
    }

    @ApiOperation({summary:"For update post"})
    @ApiResponse({status:200,description:"Updated"})
    @Patch()
    updatePost(@Body() patchPostDto:PatchPostDto){
        console.log(patchPostDto);
    }
    
    @Delete("/:id")
    deletePost(@Param("id", ParseIntPipe) id:number){
        return this.postService.deletePost(id);
    }

}
