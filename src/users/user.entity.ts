import { Exclude } from "class-transformer";
import { Post } from "src/posts/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        type:"varchar",
        length:20,
        nullable:false
    })
    firstName: string;

    @Column({
        type:"varchar",
        length:20,
        nullable:false,
    })
    lastName: string;

    @Column({
        type:"varchar",
        nullable:false,
        unique:true
    })
    email: string;

    @Exclude()
    @Column({
        type:"varchar",
        nullable:true
    })
    password: string;

    @Exclude()
    @Column({
        type:"varchar",
        nullable:true
    })
    googleId:string

    @OneToMany(()=>Post,(post)=>post.author)
    posts:Post[]

    
}