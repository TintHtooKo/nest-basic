### Exception error handling
[text](https://docs.nestjs.com/exception-filters#built-in-http-exceptions)

### Transaction
NestJS နဲ့ TypeORM မှာ Transaction ဆိုတာ Multi-step database operations (ဒေတာဘေ့စ် လုပ်ဆောင်ချက် အဆင့်ဆင့်) တွေကို "တစ်ခုတည်းသော လုပ်ဆောင်ချက်" (Single Atomic Unit) အဖြစ် စုစည်းပြီး အလုပ်လုပ်ပေးတဲ့ နည်းလမ်းဖြစ်ပါတယ်။

အဓိက သဘောတရားကတော့ "အကုန်အောင်မြင်ရင် အကုန် သိမ်းမယ် (Commit)၊ တစ်ခုခု မှားသွားရင် နဂိုအတိုင်း အကုန် ပြန်ပြင်မယ် (Rollback)" ဆိုတဲ့ ACID သဘောတရား ဖြစ်ပါတယ်။

၁။ ဘာကြောင့် Transaction ကို သုံးရသလဲ? (Real-World Example)
ဥပမာ - ဘဏ်ငွေလွှဲစနစ် (Bank Transfer):
အသုံးပြုသူ A က B ထံ ငွေ ၁၀,၀၀၀ ကျပ် လွှဲမည်ဆိုပါစို့။

Step 1: User A ရဲ့ Account ထဲက ၁၀,၀၀၀ နှုတ်ရမည်။

Step 2: User B ရဲ့ Account ထဲသို့ ၁၀,၀၀၀ ပေါင်းထည့်ရမည်။

Transaction မပါရင် ဘာဖြစ်မလဲ?

Step 1 ပြီးလို့ User A ထဲက ငွေနှုတ်ပြီးချိန်မှာ Server ရုတ်တရက် ကျသွားရင် သို့မဟုတ် Step 2 မှာ Error တက်သွားရင် User A ထဲက ငွေနှုတ်ပြီး ဖြစ်သွားသော်လည်း User B ထဲ ငွေမရောက်တော့ပါ။

Transaction ပါရင် ဘာဖြစ်မလဲ?

Step 2 မှာ Error တက်တာနဲ့ Transaction က Step 1 မှာ လုပ်ခဲ့သမျှကိုပါ နဂိုအတိုင်း ပြန်ဖျက်ပေး (Rollback) လိုက်သည့်အတွက် User A ရဲ့ ငွေလည်း မဆုံးရှုံးတော့ပါ။

This is example code for create multiple users using transaction.
first of all create file in user/provider
```
nest g pr multi-user-create.provider --flat --no-spec
```


```
import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { CreateMultiUserDto } from '../dtos/multi-create-users.dto';

@Injectable()
export class MultiUserCreateProvider {
    constructor(
        private readonly dataSource:DataSource
    ){}

    async createMulti(createUsersDto:CreateMultiUserDto){
        const newUsers: User[] = []

        // Query runner instance
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            // Connect
            await queryRunner.connect();

            // Start transaction
            await queryRunner.startTransaction();
        } catch (error) {
            throw new RequestTimeoutException('Cannot process your request this time.',{
                description:"Cannot connect to database"
            })
        }

        try {
            for(let user of createUsersDto.users){
                let newUser = queryRunner.manager.create(User,user)
                let result = await queryRunner.manager.save(newUser)
                newUsers.push(result)
            }

            // If success, commit
            await queryRunner.commitTransaction();
        } catch (error) {
            // if failed, rollback
            await queryRunner.rollbackTransaction();
            throw new ConflictException("cannot complete request",{
                description:String(error)
            })
        }finally{
            // release
            await queryRunner.release();
        }
        return newUsers
    }
}

```

First , you have to inject Database Source from typeorm
```
import { DataSource } from 'typeorm';
constructor(
        private readonly dataSource:DataSource
    ){}
```

There are six step for Transaction
1- Instance query runner
```
const queryRunner = this.dataSource.createQueryRunner();
```

2- Connect
```
await queryRunner.connect();
```

3- Start Transaction
```
await queryRunner.startTransaction();
```

4- If success, commit
```
await queryRunner.commitTransaction();
```

5- If failed, rollback
```
await queryRunner.rollbackTransaction();
```

6- Finally release
```
await queryRunner.release();
```

### Pagination
We can make global pagination which can use in all services.

First we have to create src/common/pagination folder

Inside pagination create interface type for pagination

paginated.interface.ts
```
export interface Paginated<T> {
    data: T[];
    metadata: {
        itemPerPage: number
        currentPage: number
        totalItems: number
        totalPages: number
    };
    links:{
        first: string
        last: string
        current: string 
        next: string
        prev: string
    }
}
```
What is <T>?
<T> means for all, eg. User, Post etc

And then create dto for pagination
pagination-query.dto.ts
```
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    @IsPositive()
    @Type(()=>Number)
    limit: number;

    @IsOptional()
    @IsPositive()
    @Type(()=>Number)
    page: number;
}
```

And then create provider and module for pagination
pagination.provider.ts
```
import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
    constructor(
        @Inject(REQUEST)
        private readonly request:Request
    ){}

    async paginateQuery<T extends ObjectLiteral>(
        paginateQuery:PaginationQueryDto, 
        repository:Repository<T>
    ):Promise<Paginated<T>>{

        if(!paginateQuery.page || !paginateQuery.limit){
            throw new Error('Page and limit are required')
        }

        const result = await repository.find({
            skip:(paginateQuery.page - 1) * paginateQuery.limit,
            take: paginateQuery.limit
        })

        const baseUrl = this.request.protocol + '://' + this.request.headers.host
        
        const newUrl = new URL(this.request.url, baseUrl)

        const totalItems = await repository.count()

        const totalPages = Math.ceil(totalItems / paginateQuery.limit)

        const nextPage = paginateQuery.page === totalPages ? paginateQuery.page : paginateQuery.page + 1

        const prevPage = paginateQuery.page === 1 ? paginateQuery.page : paginateQuery.page - 1 

        return {
            data: result,
            metadata:{
                itemPerPage: paginateQuery.limit,
                totalItems,
                currentPage: paginateQuery.page,
                totalPages,
            },
            links:{
                    first: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=1`,
                    last: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${totalPages}`,
                    current: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${paginateQuery.page}`,
                    next: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${nextPage}`,
                    prev: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit}&page=${prevPage}`,
            }
        }
    }
}
```

What is this for?
@Inject(REQUEST)
private readonly request:Request

NestJS ၏ Request Context ကို ရယူပြီး Client မှ တောင်းဆိုလိုက်သော Host, Protocol နှင့် URL လမ်းကြောင်းများကို ဖတ်ရန် အသုံးပြုပါသည်။

And then import from pagination.module.ts
```
import { Module } from '@nestjs/common';
import { PaginationProvider } from './provider/pagination.provider';

@Module({
  providers: [PaginationProvider],
  exports: [PaginationProvider]
})
export class PaginationModule {}

```

And then you can use service what you want.
Eg. in post.service.ts
```
findAllPost(postQuery:GetPostDto){
    let post
    if(postQuery.limit || postQuery.page){
        post = this.paginationProvider.paginateQuery(postQuery, this.postRepository)
    }else{
        post = this.postRepository.find()
    }
    return post
}
```

get.post.dto.ts
```
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";

export class GetPostDto extends PaginationQueryDto {}
```


