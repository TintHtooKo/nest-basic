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
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import envValidation from './config/env.validation';

const ENV = process.env.NODE_ENV

@Module({
  imports: [UsersModule, PostsModule, AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService:ConfigService)=>({
        type: 'postgres',
        // entities: [User,Post,Tag,PostMeta],
        autoLoadEntities:true,
        synchronize: true,
        port : +configService.get("database.port"),
        username: configService.get("database.username"),
        password: configService.get("database.password"),
        host: configService.get("database.host"),
        database: configService.get("database.name"),
      })
    }), 
  TagsModule, PostMetaModule,
  ConfigModule.forRoot({
    isGlobal:true,
    envFilePath: ENV ? `.env.${ENV}` : '.env',
    load: [databaseConfig],
    validationSchema: envValidation
  })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
