import { Injectable } from '@nestjs/common';
import { MetaOption } from '../meta-option.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async create(
    CreatePostMetaOptionsDto: CreatePostMetaOptionsDto,
  ): Promise<MetaOption> {
    const metaOption = this.metaOptionRepository.create(
      CreatePostMetaOptionsDto,
    );
    return this.metaOptionRepository.save(metaOption);
  }
}
