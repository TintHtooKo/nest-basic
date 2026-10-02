import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tag{
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type:"varchar",
        nullable:false,
        unique:true
    })
    label:string

    @Column({
        type:"varchar",
        nullable:true
    })
    description:string
}