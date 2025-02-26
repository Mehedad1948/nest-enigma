import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsServices } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [PostsController],
  providers: [PostsServices],
  imports: [UsersModule],
})
export class PostsModule {}
