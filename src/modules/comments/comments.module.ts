import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { UsersModule } from 'modules/users/users.module';
import { PostsModule } from 'modules/posts/posts.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [UsersModule, PostsModule],
})
export class CommentsModule {}
