import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Delete(':id')
  async deleteTag(@Param('id') id: number) {
    return this.tagsService.deleteTag(id);
  }

  @Delete('soft-delete/:id')
  async softDeleteTag(@Param('id') id: number) {
    console.log('🔥🔥🔥🔥', id);

    return await this.tagsService.softDeleteTag(id);
  }

  @Post()
  async createTag(@Body() body: CreateTagDto) {
    return this.tagsService.createTag(body);
  }
}
