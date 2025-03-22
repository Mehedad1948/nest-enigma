import { Controller, Post, Body } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async createTag(@Body() body: CreateTagDto) {
    return this.tagsService.createTag(body);
  }
}
