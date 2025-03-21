import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsServices } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
@Module({
  controllers: [PostsController],
  providers: [PostsServices],
  imports: [UsersModule, TypeOrmModule.forFeature([Post, MetaOption])],
})
export class PostsModule {}
