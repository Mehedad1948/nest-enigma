import { Injectable } from '@nestjs/common';
import { Tag } from '../tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: Repository<Tag>) {}
}
