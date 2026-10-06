import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/users/providers/user.service';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create.post.dto';
import { UserData } from 'src/auth/interfaces/user-data.interface';

@Injectable()
export class CreatePostProvider {
    constructor(
        private readonly userService:UserService,
        
        @InjectRepository(Post)
        private readonly postsRepository:Repository<Post>
    ) {}

    async createPost(createPostDto:CreatePostDto, user:UserData){
        let author = undefined
        try {
            author = await this.userService.findUserById(user.id)
        } catch (error) {
            throw new ConflictException(error)
        }
        let post = this.postsRepository.create({...createPostDto,author:author})
        try {
            return await this.postsRepository.save(post)    
        } catch (error) {
            throw new ConflictException(error,{description:"Cannot create post"})
        }
    }
}
