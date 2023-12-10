import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from 'modules/users/users.module';
import { postServiceProvider } from './providers/post-service.provider';

@Module({
  controllers: [PostsController],
  providers: [PostsService, postServiceProvider],
  exports: [PostsService],
  imports: [UsersModule],
})
export class PostsModule {}
