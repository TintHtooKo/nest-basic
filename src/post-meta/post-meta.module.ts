import { Module } from '@nestjs/common';
import { PostMetaController } from './post-meta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMeta } from './post-meta.entity';

@Module({
  controllers: [PostMetaController],
  imports: [TypeOrmModule.forFeature([PostMeta])]
})
export class PostMetaModule {}
 