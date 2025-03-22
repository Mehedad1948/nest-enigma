import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePostsDto } from './dtos/create-post.dto';
import { PostsServices } from './providers/posts.service';
import { PatchPostDto } from './dtos/patch-post.dto';

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

  @Patch()
  public updatePost(@Body() patchPostsDto: PatchPostDto) {
    return this.postsServices.update(patchPostsDto);
  }

  @Delete(':id')
  public deletePost(@Param('id') id: number) {
    console.log('🔥🔥 deletePost', id);

    return this.postsServices.deletePost(id);
  }
}
