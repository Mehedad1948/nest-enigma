import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostsDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { Tag } from 'src/tags/tag.entity';
@Injectable()
export class PostsServices {
  constructor(
    private readonly userService: UsersService,

    private readonly tagsService: TagsService,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}
  public async getAllPosts(limit: number) {
    const user = this.userService.findOneById(limit);
    return await this.postRepository.find({
      // relations: ['author', 'tags'],
    });
  }

  public async createPost(createPostsDto: CreatePostsDto) {
    const author = await this.userService.findOneById(createPostsDto.authorId);
    let tags: Tag[] = [];
    if (createPostsDto.tags) {
      tags = await this.tagsService.findMultipleTags(createPostsDto.tags);
    }
    const post = this.postRepository.create({
      ...createPostsDto,
      author,
      tags,
    });
    return await this.postRepository.save(post);
  }

  public async deletePost(id: number) {
    await this.postRepository.delete(id);
    // if (post.metaOptions) {
    //   await this.metaOptionRepository.delete(post.metaOptions.id);
    // }
    return { id, deleted: true };
  }
}
