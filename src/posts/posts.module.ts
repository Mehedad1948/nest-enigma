import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsServices } from './providers/posts.service';

@Module({ controllers: [PostsController], providers: [PostsServices] })
export class PostsModule {}
