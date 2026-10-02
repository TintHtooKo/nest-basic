import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create.post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postRepository:Repository<Post>
    ){}

    getAllPostsById(userId:string) {
        console.log(userId);
        return [
            {id:1, title:"title 1", content:"content 1", authorId:1},
            {id:2, title:"title 2", content:"content 2", authorId:2},
            {id:3, title:"title 3", content:"content 3", authorId:3},
        ]
    }

    findAllPost(){
        return this.postRepository.find()
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
