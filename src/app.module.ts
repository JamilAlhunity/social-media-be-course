import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './core/guards/access-token/access-token.guard';
import { ModulesModule } from 'modules/modules.module';
import { jwtOptions } from 'shared/configs/app.option';
import { CacheModule } from 'core/lib/cache/cache.module';

@Module({
  imports: [
    JwtModule.register(jwtOptions),
    CacheModule.register('cache-manager-redis-yet'),
    ModulesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
