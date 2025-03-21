import { Injectable } from '@nestjs/common';
import { CreatePostsDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
@Injectable()
export class PostsServices {
  constructor(
    private readonly userService: UsersService,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}
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

  public async createPost(createPostsDto: CreatePostsDto) {
    const metaOptions = createPostsDto.metaOptions
      ? this.metaOptionRepository.create(createPostsDto.metaOptions)
      : undefined;

    if (metaOptions) {
      await this.metaOptionRepository.save(metaOptions);
    }

    const post = this.postRepository.create({
      ...createPostsDto,
      metaOptions: metaOptions,
    });

    return await this.postRepository.save(post);
  }
}
