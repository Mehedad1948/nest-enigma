import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postStatus } from '../enums/postStatus.enum';
import { PostType } from '../enums/postType.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreatePostsDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My first post',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(512)
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the content of my first post',
  })
  @IsString()
  content?: string;

  @ApiProperty({
    enum: PostType,
    description: 'The type of the post',
    example: 'post',
  })
  @IsNotEmpty()
  postType: PostType;

  @ApiProperty({
    description: 'The slug of the post',
    example: 'my-first-post',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers and hyphens',
  })
  slug: string;

  @ApiProperty({
    description: 'The status of the post',
    example: 'draft',
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiProperty({
    description: 'The schema of the post',
    example: '{}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiProperty({
    description: 'The tags of the post',
    example: ['tag1', 'tag2'],
  })
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'The image of the post',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiProperty({
    description: 'The published date of the post',
    example: '2025-03-19T00:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601()
  publishedOn?: Date;

  @ApiPropertyOptional({
    required: false,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        metaValue: { type: 'json' },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto | null;
}
