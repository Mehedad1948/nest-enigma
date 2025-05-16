import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { TagsService } from 'src/tags/providers/tags.service';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { Tag } from 'src/tags/tag.entity';
import { CreatePostsDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class CreatePostProvider {
  constructor(
    private readonly tagsService: TagsService,

    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  public async CreateUser(
    createPostsDto: CreatePostsDto,
    userData: ActiveUserData,
  ) {
    try {
      const author = await this.usersService.findOneById(userData.sub);
      if (!author) {
        throw new NotFoundException('Author not found');
      }

      let tags: Tag[] = [];
      if (createPostsDto.tags?.length) {
        tags = await this.tagsService.findMultipleTags(createPostsDto.tags);
        if (tags.length !== createPostsDto.tags.length) {
          throw new BadRequestException('Some tags were not found');
        }
      }

      const post = this.postRepository.create({
        ...createPostsDto,
        author,
        tags,
      });

      return await this.postRepository.save(post);
    } catch (error) {
      // You can add specific handling if needed
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      // Log error here if needed
      throw new InternalServerErrorException('Failed to create post');
    }
  }
}
