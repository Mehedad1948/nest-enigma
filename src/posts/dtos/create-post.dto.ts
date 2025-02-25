import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  content: string;
}
