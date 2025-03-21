import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private metaOptionService: MetaOptionsService) {}

  @Post()
  public async createMetaOptions(
    @Body() createPostMetaOptionsDto: CreatePostMetaOptionsDto,
  ) {
    return await this.metaOptionService.create(createPostMetaOptionsDto);
  }
}
