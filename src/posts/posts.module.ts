import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsServices } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsModule } from 'src/tags/tags.module';
import { Tag } from 'src/tags/tag.entity';
import { PaginationModule } from 'src/common/pagination/dtos/pagination.module';

@Module({
  controllers: [PostsController],
  providers: [PostsServices],
  imports: [
    UsersModule,
    TagsModule,
    PaginationModule,
    TypeOrmModule.forFeature([Post, MetaOption, Tag]),
  ],
})
export class PostsModule {}
