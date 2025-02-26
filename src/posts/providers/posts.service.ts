import { Injectable } from '@nestjs/common';
import { CreatePostsDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsServices {
  constructor(private readonly userService: UsersService) {}
  public getAllPosts(limit: number) {
    const user = this.userService.findOneById(limit);
    return [
      {
        id: 1,
        user,
        title: 'First Post',
        content: 'This is the content of the first post',
      },
      {
        id: 2,
        user,
        title: 'Second Post',
        content: 'This is the content of the second post',
      },
    ].slice(0, limit);
  }

  public createPost(createPostsDto: CreatePostsDto) {
    return createPostsDto;
  }
}
