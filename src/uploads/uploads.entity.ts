import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Upload{
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type:"varchar",
        length:256,
        nullable:false
    })
    name:string

    @Column({
        type:"varchar",
        length:256,
        nullable:false
    })
    path:string

    @Column({
        type:"varchar",
        length:256,
        nullable:false
    })
    mime:string

    @Column({
        type:"int",
        nullable:false
    })
    size:number

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date
}