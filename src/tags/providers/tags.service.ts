import { Injectable, NotFoundException } from '@nestjs/common';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}
  public async createTag(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    return this.tagsRepository.save(tag);
  }

  public async deleteTag(id: number) {
    const tag = await this.tagsRepository.findOne({
      where: {
        id,
      },
    });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return this.tagsRepository.delete(tag);
  }

  public async softDeleteTag(id: number) {
    const tag = await this.tagsRepository.findOne({
      where: {
        id,
      },
    });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return this.tagsRepository.softDelete(id);
  }

  public async findMultipleTags(tags: number[]) {
    const results = await this.tagsRepository.find({
      where: {
        id: In(tags),
      },
    });
    return results;
  }
}
