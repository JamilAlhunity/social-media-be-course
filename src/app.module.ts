import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ModulesModule } from 'modules/modules.module';
import { i18nOptions, jwtOptions } from 'shared/configs/app.option';
import { CacheModule } from 'core/lib/cache/cache.module';
import { I18nModule } from 'nestjs-i18n';
import { filters, guards } from 'shared/configs/app.config';
import { LoggerModule } from 'core/lib/logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    I18nModule.forRoot(i18nOptions),
    JwtModule.register(jwtOptions),
    CacheModule.register('cache-manager-redis-yet'),
    ModulesModule,
  ],
  controllers: [],
  providers: [...guards, ...filters],
  exports: [],
})
export class AppModule {}
