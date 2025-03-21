import { Controller } from '@nestjs/common';
import { TagsService } from './providers/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
}
