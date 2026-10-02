import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Post } from './posts/post.entity';
import { TagsModule } from './tags/tags.module';
import { Tag } from './tags/tag.entity';
import { PostMetaModule } from './post-meta/post-meta.module';
import { PostMeta } from './post-meta/post-meta.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, PostsModule, AuthModule,TypeOrmModule.forRoot({
    type: 'postgres',
    // entities: [User,Post,Tag,PostMeta],
    synchronize: true,
    port : 5432,
    username: 'postgres',
    password: 'superuser',
    host: 'localhost',
    database: 'nest-basic'
  }), TagsModule, PostMetaModule,ConfigModule.forRoot({isGlobal:true})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
