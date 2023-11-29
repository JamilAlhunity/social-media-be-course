import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, PostsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
