import {
  IsNotEmpty,
  IsString,
  MaxLength,
  Matches,
  IsJSON,
} from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must contain only lowercase letters, numbers and hyphens',
  })
  slug: string;

  @IsString()
  description?: string;

  @IsString()
  @IsJSON()
  schema?: string;

  @IsString()
  featuredImage?: string;
}
