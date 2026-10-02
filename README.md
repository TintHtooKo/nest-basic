## Database part

### Install necessary packages
Before starting database, we have to install these three package
@nestjs/typeorm, typeorm and pg (postgre)
```
npm i --save @nestjs/typeorm typeorm
```
```
npm i pg
```

After installed packages, import in App moduel
```
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    entities: [],
    synchronize: true,
    port : 5432,
    username: 'postgres',
    password: 'superuser',
    host: 'localhost',
    database: 'nest-basic'
  })],
  controllers: [AppController],
  providers: [AppService],
})
```
And then create database in pgadmin and run project.

### Create Entity
What is entity? Entity is table for database
If you want user entity, create inside of users folder
users/user.entity.ts
We have also user dto for validation. So make match with user dto
Eg.
```
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({
        type:"varchar",
        nullable:false
    })
    password: string;
}
```
What is @Entity()?
When you add @Entity(), your code will know that is entity file.

What is @PrimaryGeneratedColumn()?
It will do auto increment.

What is @Column?
That is for database table rule.

And then import in app.module.ts inside of entity.
import { User } from './users/user.entity';
```
entities: [User],
```

app.module.ts မှာ  import လုပ်ပီးရင် သက်ဆိုင်ရာ module မှာလည်း ထပ်ပီး import လုပ်ရမယ်
Eg. User entity ဆိုတော့ user.module.ts မှာ ထပ်ပီး import လုပ်
```
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
imports:[
    TypeOrmModule.forFeature([User])
  ]
```

ပီးရင် user entity ကို service ထဲမှာ ခေါ်သုံးတော့မယ်။ မသုံးခင်အရင်ဆုံး contractor ထဲမှာ repository inject လုပ်ပေးရမယ်

```
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>
    ){}
```
What is Repository<User>?
User Entity (Database table) နဲ့ ပတ်သက်တဲ့ Database လုပ်ဆောင်ချက်တွေ (ဥပမာ - find(), findOne(), save(), delete(), create()) အားလုံးကို ပြုလုပ်ပေးနိုင်တဲ့ Helper class ဖြစ်ပါတယ်။

What is @InjectRepository(User)?
NestJS ရဲ့ Dependency Injection (DI) စနစ်ကို သုံးပြီး User Table နဲ့ သက်ဆိုင်တဲ့ Repository instance ကို အလိုအလျောက် ယူဆောင်ပေးတာ ဖြစ်ပါတယ်။
Module ထဲမှာ TypeOrmModule.forFeature([User]) ဆိုပြီး ထည့်ထားခဲ့ရင် NestJS က ဒီ Decorator ကို မြင်တာနဲ့ သက်ဆိုင်ရာ Repository ကို ရှာပြီး ချိတ်ဆက်ပေးပါလိမ့်မယ်။

And then you can use like this?
Eg.
```
async createUser(createUserDto:CreateUserDto){
        const existUser = await this.userRepository.findOne({
            where:{email:createUserDto.email}
        })
        let newUser = this.userRepository.create(createUserDto)
        newUser = await this.userRepository.save(newUser)
        return newUser
    }
```

### Table Relation
It is simple. If you want to do one to one
Eg
Post => PostMeta
in post entity
```
<!-- This is post entity -->
import {  OneToOne } from "typeorm";
import { PostMeta } from "src/post-meta/post-meta.entity";

@Entity()
export class Post{

    @OneToOne(()=>PostMeta,(postMeta)=>postMeta.post,{
        cascade:true,
        eager:true
    })
    meta:PostMeta
}

<!-- This is post meta entity -->
import { Post } from "src/posts/post.entity";
import {  OneToOne, JoinColumn } from "typeorm";

@Entity()
export class PostMeta{
    @OneToOne(()=>Post,(post)=>post.meta)
    @JoinColumn()
    post:Post
}
```
@JoinColumn ကို children database ထဲမှာဘဲ ထည့်
TypeORM မှာ eager: true ဆိုတာ Main Entity (Post) ကို Database ကနေ ဆွဲထုတ်ယူ (Query လုပ်) လိုက်တာနဲ့ သက်ဆိုင်ရာ Related Entity (PostMeta) ကိုပါ Automatically တစ်ခါတည်း ဆွဲထုတ်ပေးမယ် လို့ ခိုင်းစေတာ ဖြစ်ပါတယ်။

**Important note**
Entity တိုင်းမှာ eager: true လိုက်သုံးရင် Database Query ပိုလေးသွားနိုင်ပါတယ်။
One-to-One Relationships: Post နဲ့ PostMeta လိုမျိုး ၁ ခုနဲ့ ၁ ခု အမြဲ တွဲလျက် ရှိနေတတ်တဲ့ Relationship မျိုးမှာ သုံးဖို့ အထူးသင့်တော်ပါတယ်။


