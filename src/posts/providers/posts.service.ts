import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
    getAllPosts(userId:string) {
        console.log(userId);
        return [
            {id:1, title:"title 1", content:"content 1", authorId:1},
            {id:2, title:"title 2", content:"content 2", authorId:2},
            {id:3, title:"title 3", content:"content 3", authorId:3},
        ]
    }
}
