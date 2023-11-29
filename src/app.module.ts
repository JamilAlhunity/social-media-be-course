import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './core/guards/access-token/access-token.guard';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: '$0cI4lM3dI4ApPf0rN3$tJ$C0uR$3_AccessToken',
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
