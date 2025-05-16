import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePostsDto } from './dtos/create-post.dto';
import { GetPostsDto } from './dtos/get-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { PostsServices } from './providers/posts.service';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

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
  public createPost(
    @Body() createPostsDto: CreatePostsDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.postsServices.createPost(createPostsDto, user);
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
