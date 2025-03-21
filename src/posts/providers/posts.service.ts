import { Injectable, NotFoundException } from '@nestjs/common';
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
  public async getAllPosts(limit: number) {
    const user = this.userService.findOneById(limit);
    return await this.postRepository.find();
  }

  public async createPost(createPostsDto: CreatePostsDto) {
    const post = this.postRepository.create(createPostsDto);
    return await this.postRepository.save(post);
  }

  public async deletePost(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    await this.postRepository.delete(id);
    if (post.metaOptions) {
      await this.metaOptionRepository.delete(post.metaOptions.id);
    }
    return { id, deleted: true };
  }
}
