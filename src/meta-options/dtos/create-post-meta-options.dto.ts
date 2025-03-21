import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @IsJSON()
  @IsNotEmpty()
  metaValue: string;
}
