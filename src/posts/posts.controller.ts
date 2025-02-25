import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePostsDto } from './dtos/create-post.dto';
import { PostsServices } from './providers/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsServices: PostsServices) {}
  @Get()
  public getAllPosts(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postsServices.getAllPosts(limit);
  }

  @Post()
  public createPost(@Body() createPostsDto: CreatePostsDto) {
    console.log('🔥🔥', createPostsDto);

    return this.postsServices.createPost(createPostsDto);
  }
}
