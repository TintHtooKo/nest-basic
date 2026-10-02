import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { postStatus } from "./enums/postStatus.enum";
import { Tag } from "src/tags/tag.entity";
import { PostMeta } from "src/post-meta/post-meta.entity";
import { User } from "src/users/user.entity";

@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type:"varchar",
        length:256,
        nullable:false
    })
    title:string

    @Column({
        type:"varchar",
        nullable:false,
        unique:true
    })
    slug:string

    @Column({
        type:"enum",
        enum:postStatus,
        nullable:false,
        default:postStatus.DRAFT
    })
    status:postStatus

    @Column({
        type:"text",
        nullable:false
    })
    content:string

    @Column({
        type:"varchar",
        nullable:true
    })
    featureImgUrl:string

    @Column({
        type:"timestamp",
        nullable:true
    })
    publishOn:string

    tags:Tag[]

    @OneToOne(()=>PostMeta,(postMeta)=>postMeta.post,{
        cascade:true,
        eager:true
    })
    meta:PostMeta

    @ManyToOne(()=>User,(user)=>user.posts)
    author: User
}