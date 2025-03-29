import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreatePostsDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { Tag } from 'src/tags/tag.entity';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { GetPostsDto } from '../dtos/get-post.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
@Injectable()
export class PostsServices {
  constructor(
    private readonly userService: UsersService,

    private readonly tagsService: TagsService,

    private readonly paginationProvider: PaginationProvider,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}
  public async getAllPosts(
    userId: number,
    postQuery: GetPostsDto,
  ): Promise<Paginated<Post>> {
    // const user = await this.userService.findOneById(userId);
    return await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postRepository,
    );
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

  public async update(patchPostDto: PatchPostDto) {
    let tags: Tag[] = [];
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags || []);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to find tags, please try again later',
        {
          description: 'Error connecting to the database',
          cause: error,
        },
      );
    }

    if (
      !!patchPostDto.tags?.length &&
      tags?.length !== patchPostDto.tags?.length
    ) {
      throw new BadRequestException('Tags do not match');
    }

    let post: Post | null = null;
    try {
      post = await this.postRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to find post, please try again later',
        {
          description: 'Error connecting to the database',
          cause: error,
        },
      );
    }

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.tags = tags;
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.postType = patchPostDto.postType ?? post.postType;
    post.status = patchPostDto.status ?? post.status;
    post.schema = patchPostDto.schema ?? post.schema;
    post.slug = patchPostDto.slug ?? post.slug;
    post.image = patchPostDto.image ?? post.image;
    // post.author = patchPostDto.authorId ?? post.author;
    try {
      return await this.postRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to update post, please try again later',
        {
          description: 'Error connecting to the database',
          cause: error,
        },
      );
    }
  }
}
