import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create.post.dto';
import { GetPostDto } from '../dto/get.post.dto';
import { PaginationProvider } from 'src/common/pagination/provider/pagination.provider';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postRepository:Repository<Post>,

        private readonly paginationProvider:PaginationProvider
    ){}

    getAllPostsById(userId:string) {
        console.log(userId);
        return [
            {id:1, title:"title 1", content:"content 1", authorId:1},
            {id:2, title:"title 2", content:"content 2", authorId:2},
            {id:3, title:"title 3", content:"content 3", authorId:3},
        ]
    }

    findAllPost(postQuery:GetPostDto){
        let post
        if(postQuery.limit || postQuery.page){
            post = this.paginationProvider.paginateQuery(postQuery, this.postRepository)
        }else{
            post = this.postRepository.find()
        }
        return post
    }

    async addPost(createPostDto:CreatePostDto){
        let post = this.postRepository.create(createPostDto)
        post = await this.postRepository.save(post)
        return post
    }

    async deletePost(id:number){
        await this.postRepository.delete(id)
        return {message:"Post deleted"}
    }
}
