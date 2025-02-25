import { Injectable } from '@nestjs/common';
import { CreatePostsDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsServices {
  public getAllPosts(limit: number) {
    return [
      {
        id: 1,
        title: 'First Post',
        content: 'This is the content of the first post',
      },
      {
        id: 2,
        title: 'Second Post',
        content: 'This is the content of the second post',
      },
    ].slice(0, limit);
  }
  public createPost(createPostsDto: CreatePostsDto) {
    return createPostsDto;
  }
}
