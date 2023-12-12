import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ModulesModule } from 'modules/modules.module';
import {
  configOptions,
  i18nOptions,
  jwtOptions,
} from 'shared/configs/app.option';
import { CacheModule } from 'core/lib/cache/cache.module';
import { I18nModule } from 'nestjs-i18n';
import { filters, guards, interceptors } from 'shared/configs/app.config';
import { LoggerModule } from 'core/lib/logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobModule } from 'core/lib/cron-job/cron-job.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    LoggerModule,
    ScheduleModule.forRoot(),
    CronJobModule,
    I18nModule.forRoot(i18nOptions),
    JwtModule.registerAsync(jwtOptions),
    CacheModule.register('cache-manager-redis-yet'),
    ModulesModule,
  ],
  controllers: [],
  providers: [...guards, ...filters, ...interceptors],
  exports: [],
})
export class AppModule {}
