import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { JwtModuleOptions } from '@nestjs/jwt';
import { redisStore } from 'cache-manager-redis-yet';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nOptions,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { RedisClientOptions } from 'redis';

export const jwtOptions: JwtModuleOptions = {
  global: true,
  secret: '$0cI4lM3dI4ApPf0rN3$tJ$C0uR$3_AccessToken',
};

export const cacheManagerOptions: CacheModuleAsyncOptions<RedisClientOptions> =
  {
    useFactory: async () => ({
      store: redisStore,
      socket: {
        host: 'localhost',
        port: 6379,
        tls: false,
      },
    }),
  };

export const i18nOptions: I18nOptions = {
  fallbackLanguage: 'en',
  loaderOptions: {
    path: join(__dirname, '../../resources/i18n'),
    watch: true,
  },
  typesOutputPath: join(
    `${process.cwd()}/src/resources/generated/i18n.generated.ts`,
  ),
  resolvers: [
    { use: QueryResolver, options: ['lang', 'locale', 'l'] },
    new HeaderResolver(['x-custom-lang']),
    AcceptLanguageResolver,
    new CookieResolver(['lang', 'locale', 'l']),
  ],
};
