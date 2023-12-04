import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { JwtModuleOptions } from '@nestjs/jwt';
import { redisStore } from 'cache-manager-redis-yet';
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
