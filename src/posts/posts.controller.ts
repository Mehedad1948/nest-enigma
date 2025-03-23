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
import { GetPostsDto } from './dtos/get-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsServices: PostsServices) {}
  @Get(':userId')
  public getAllPosts(
    @Query() postQuery: GetPostsDto,
    @Param('userId') userId: number,
  ) {
    return this.postsServices.getAllPosts(userId, postQuery);
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
