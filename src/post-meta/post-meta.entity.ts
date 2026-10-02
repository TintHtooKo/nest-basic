import { Post } from "src/posts/post.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PostMeta{
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type:"varchar",
        nullable:false
    })
    readTime:string

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date

    @OneToOne(()=>Post,(post)=>post.meta,{
        onDelete:"CASCADE"
    })
    @JoinColumn()
    post:Post
}