import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostsDto } from './create-post.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PatchPostDto extends PartialType(CreatePostsDto) {
  @ApiProperty({
    description: 'The id of the post',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
